"use client";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "@/lib/genres";
import { cn } from "@/lib/utils";
import axios from "axios";
import { BookCheck, BookMarked, BookOpen, Compass, FileText, Library } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LibraryCard from "./LibraryCard";

type Tab = "all" | ReadingStatus;

const TABS: { value: Tab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "reading", label: "Reading" },
    { value: "want-to-read", label: "Want to Read" },
    { value: "finished", label: "Finished" },
];

const LibraryView = () => {
    const [items, setItems] = useState<LibraryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>("all");

    useEffect(() => {
        axios
            .get("/api/library")
            .then((res) => setItems(res.data.items))
            .catch(() => toast.error("Couldn't load your library"))
            .finally(() => setLoading(false));
    }, []);

    const stats = useMemo(() => {
        const year = new Date().getFullYear();
        const genreCounts = new Map<string, number>();
        items.forEach((e) => e.book.genre.forEach((g) => genreCounts.set(g, (genreCounts.get(g) ?? 0) + 1)));
        const topGenres = [...genreCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

        return {
            reading: items.filter((e) => e.status === "reading").length,
            want: items.filter((e) => e.status === "want-to-read").length,
            finished: items.filter((e) => e.status === "finished").length,
            finishedThisYear: items.filter(
                (e) => e.status === "finished" && e.finishedAt && new Date(e.finishedAt).getFullYear() === year
            ).length,
            pagesRead: items.reduce((sum, e) => sum + (e.currentPage ?? 0), 0),
            topGenres,
            maxGenre: topGenres[0]?.[1] ?? 1,
        };
    }, [items]);

    const visible = tab === "all" ? items : items.filter((e) => e.status === tab);
    const countFor = (t: Tab) => (t === "all" ? items.length : t === "reading" ? stats.reading : t === "finished" ? stats.finished : stats.want);

    const update = async (bookId: string, body: Partial<Pick<LibraryEntry, "status" | "currentPage">>) => {
        setBusyId(bookId);
        try {
            const res = await axios.patch(`/api/library/${bookId}`, body);
            const updated = res.data.entry;
            setItems((prev) => prev.map((e) => (e.book._id === bookId ? { ...e, ...updated, book: e.book } : e)));
            if (updated.status === "finished" && body.status !== "finished") {
                toast.success("Marked as finished");
            } else {
                toast.success(body.status ? `Moved to “${STATUS_LABELS[updated.status as ReadingStatus]}”` : "Progress saved");
            }
        } catch {
            toast.error("Couldn't update this book");
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (entry: LibraryEntry) => {
        const result = await Swal.fire({
            title: "Remove from library?",
            text: `“${entry.book.title}” and your reading progress will be removed from your shelf.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#141B34",
            cancelButtonColor: "#9CA3AF",
            confirmButtonText: "Remove",
        });
        if (!result.isConfirmed) return;

        setBusyId(entry.book._id);
        try {
            await axios.delete(`/api/library/${entry.book._id}`);
            setItems((prev) => prev.filter((e) => e._id !== entry._id));
            toast.info("Removed from your library");
        } catch {
            toast.error("Couldn't remove this book");
        } finally {
            setBusyId(null);
        }
    };

    const statTiles = [
        { label: "Books on shelf", value: items.length, icon: Library },
        { label: "Currently reading", value: stats.reading, icon: BookOpen },
        { label: `Finished in ${new Date().getFullYear()}`, value: stats.finishedThisYear, icon: BookCheck },
        { label: "Pages read", value: stats.pagesRead.toLocaleString("en-US"), icon: FileText },
    ];

    if (loading) {
        return (
            <div className="space-y-8" aria-busy>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {Array.from({ length: 4 }, (_, i) => <div key={i} className="h-24 animate-pulse rounded-md bg-stack/50" />)}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }, (_, i) => <div key={i} className="h-40 animate-pulse rounded-md bg-stack/40" />)}
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-line bg-card px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-stack">
                    <BookMarked className="h-8 w-8 text-ink" />
                </div>
                <h2 className="text-2xl font-bold text-ink">Your shelf is empty</h2>
                <p className="max-w-md text-ink-muted">
                    Find a book you love, add it to your library and start tracking your reading progress.
                </p>
                <Button asChild size="lg" className="mt-2 rounded-sm">
                    <Link href="/explore"><Compass className="h-4 w-4" /> Explore books</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statTiles.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-md border border-line/80 bg-card p-5">
                        <Icon className="h-5 w-5 text-ink-muted" />
                        <p className="mt-3 font-mono text-3xl font-medium tabular-nums text-ink">{value}</p>
                        <p className="text-sm text-ink-muted">{label}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <div className="flex gap-1 overflow-x-auto rounded-md bg-secondary p-1" role="tablist" aria-label="Filter by status">
                        {TABS.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                role="tab"
                                aria-selected={tab === t.value}
                                onClick={() => setTab(t.value)}
                                className={cn(
                                    "flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    tab === t.value ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
                                )}
                            >
                                {t.label}
                                <span className="rounded-sm bg-stack/80 px-1.5 text-xs tabular-nums">{countFor(t.value)}</span>
                            </button>
                        ))}
                    </div>

                    {visible.length === 0 ? (
                        <p className="rounded-md bg-card py-14 text-center text-ink-muted">
                            Nothing here yet.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {visible.map((entry) => (
                                <LibraryCard
                                    key={`${entry._id}-${entry.currentPage}`}
                                    entry={entry}
                                    busy={busyId === entry.book._id}
                                    onUpdate={update}
                                    onRemove={remove}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <aside className="space-y-6 lg:col-span-4">
                    <div className="rounded-md border border-line/80 bg-card p-5">
                        <h2 className="text-lg font-bold text-ink">Your top genres</h2>
                        <ul className="mt-4 space-y-3">
                            {stats.topGenres.map(([genre, count]) => (
                                <li key={genre} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <Link href={`/explore?genre=${encodeURIComponent(genre)}`} className="text-ink hover:underline">{genre}</Link>
                                        <span className="tabular-nums text-ink-muted">{count}</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-sm bg-stack/60">
                                        <div className="h-full rounded-sm bg-ink/80" style={{ width: `${(count / stats.maxGenre) * 100}%` }} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-md bg-ink p-5 text-white">
                        <p className="text-sm text-white/70">Reading breakdown</p>
                        <div className="mt-3 flex h-3 overflow-hidden rounded-sm bg-white/15">
                            {(["finished", "reading", "want-to-read"] as ReadingStatus[]).map((s) => {
                                const n = s === "finished" ? stats.finished : s === "reading" ? stats.reading : stats.want;
                                return (
                                    <div
                                        key={s}
                                        title={`${STATUS_LABELS[s]}: ${n}`}
                                        className={s === "finished" ? "bg-[#86EFAC]" : s === "reading" ? "bg-[#93B4F5]" : "bg-card"}
                                        style={{ width: `${(n / items.length) * 100}%` }}
                                    />
                                );
                            })}
                        </div>
                        <ul className="mt-3 space-y-1 text-sm">
                            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-[#86EFAC]" /> Finished · {stats.finished}</li>
                            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-[#93B4F5]" /> Reading · {stats.reading}</li>
                            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-card" /> Want to read · {stats.want}</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LibraryView;
