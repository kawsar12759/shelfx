"use client";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS, genreColor } from "@/lib/genres";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Compass } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useConfirm } from "../ConfirmDialog";
import { Shimmer } from "../BookCardSkeleton";
import LibraryCard from "./LibraryCard";

type Tab = "all" | ReadingStatus;

const TABS: { value: Tab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "reading", label: "Reading" },
    { value: "want-to-read", label: "Want to read" },
    { value: "finished", label: "Finished" },
];

const EMPTY_TAB: Record<ReadingStatus, string> = {
    reading: "Nothing in progress. Start a book from your Want to read list.",
    "want-to-read": "Your reading list is empty. Save books you'd like to read next.",
    finished: "No finished books yet. They'll collect here as you go.",
};

const BREAKDOWN: { status: ReadingStatus; color: string }[] = [
    { status: "finished", color: "#86EFAC" },
    { status: "reading", color: "#93B4F5" },
    { status: "want-to-read", color: "rgba(255,255,255,0.85)" },
];

const LibraryView = () => {
    const confirm = useConfirm();
    const [items, setItems] = useState<LibraryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>("all");

    useEffect(() => {
        axios
            .get("/api/library")
            .then((res) => setItems(res.data.items))
            .catch(() => toast.error("Couldn't load your library. Refresh to try again."))
            .finally(() => setLoading(false));
    }, []);

    const stats = useMemo(() => {
        const year = new Date().getFullYear();
        const genreCounts = new Map<string, number>();
        items.forEach((e) => e.book.genre?.forEach((g) => genreCounts.set(g, (genreCounts.get(g) ?? 0) + 1)));
        const topGenres = [...genreCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
        const byStatus: Record<ReadingStatus, number> = {
            "want-to-read": items.filter((e) => e.status === "want-to-read").length,
            reading: items.filter((e) => e.status === "reading").length,
            finished: items.filter((e) => e.status === "finished").length,
        };

        return {
            byStatus,
            finishedThisYear: items.filter(
                (e) => e.status === "finished" && e.finishedAt && new Date(e.finishedAt).getFullYear() === year
            ).length,
            pagesRead: items.reduce((sum, e) => sum + (e.currentPage ?? 0), 0),
            topGenres,
            maxGenre: topGenres[0]?.[1] ?? 1,
        };
    }, [items]);

    const visible = tab === "all" ? items : items.filter((e) => e.status === tab);
    const countFor = (t: Tab) => (t === "all" ? items.length : stats.byStatus[t]);

    const update = async (bookId: string, body: Partial<Pick<LibraryEntry, "status" | "currentPage">>) => {
        setBusyId(bookId);
        try {
            const res = await axios.patch(`/api/library/${bookId}`, body);
            const updated = res.data.entry;
            setItems((prev) => prev.map((e) => (e.book._id === bookId ? { ...e, ...updated, book: e.book } : e)));
            if (updated.status === "finished" && body.status !== "finished") {
                toast.success("Finished. Nicely done.");
            } else {
                toast.success(body.status ? `Moved to ${STATUS_LABELS[updated.status as ReadingStatus]}` : "Progress saved");
            }
        } catch {
            toast.error("Couldn't update this book. Try again.");
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (entry: LibraryEntry) => {
        const ok = await confirm({
            title: "Remove from your library?",
            description: `“${entry.book.title}” and your reading progress will be taken off your shelf.`,
            confirmLabel: "Remove",
            tone: "danger",
        });
        if (!ok) return;

        setBusyId(entry.book._id);
        try {
            await axios.delete(`/api/library/${entry.book._id}`);
            setItems((prev) => prev.filter((e) => e._id !== entry._id));
            toast.info("Removed from your library");
        } catch {
            toast.error("Couldn't remove this book. Try again.");
        } finally {
            setBusyId(null);
        }
    };

    const figures = [
        { label: "On your shelf", value: items.length },
        { label: "Reading now", value: stats.byStatus.reading },
        { label: `Finished in ${new Date().getFullYear()}`, value: stats.finishedThisYear },
        { label: "Pages read", value: stats.pagesRead.toLocaleString("en-US") },
    ];

    if (loading) {
        return (
            <div className="space-y-12" aria-busy aria-label="Loading your library">
                <Shimmer className="h-24 w-full" />
                <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }, (_, i) => <Shimmer key={i} className="h-40 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center rounded-3xl border border-line bg-card px-6 py-20 text-center">
                {/* Three empty spine outlines waiting for books */}
                <div className="flex h-20 items-end gap-1.5" aria-hidden>
                    {[64, 84, 72].map((h, i) => (
                        <span key={i} className="w-6 rounded-t-[3px] border-2 border-dashed border-ink/20" style={{ height: `${h}%` }} />
                    ))}
                </div>
                <h2 className="mt-8 text-4xl text-ink">Your shelf is empty</h2>
                <p className="mt-3 max-w-md text-ink-muted">
                    Find a book you&apos;re reading or want to read, and add it here to start tracking your progress.
                </p>
                <Button asChild size="lg" className="mt-8">
                    <Link href="/explore"><Compass /> Explore books</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-14">
            <dl className="grid grid-cols-2 gap-px border-y border-line bg-line lg:grid-cols-4">
                {figures.map(({ label, value }) => (
                    <div key={label} className="bg-background py-5 pl-5 first:pl-0 nth-3:pl-0 lg:nth-3:pl-5">
                        <dt className="eyebrow">{label}</dt>
                        <dd className="mt-2 font-serif text-5xl leading-none tabular-nums text-ink">{value}</dd>
                    </div>
                ))}
            </dl>

            <div className="grid gap-12 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <div className="scrollbar-none -mx-5 flex gap-6 overflow-x-auto border-b border-line px-5 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter by status">
                        {TABS.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                role="tab"
                                aria-selected={tab === t.value}
                                onClick={() => setTab(t.value)}
                                className={cn(
                                    "relative flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap pb-3 pt-1 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                    tab === t.value ? "text-ink" : "text-ink-muted hover:text-ink"
                                )}
                            >
                                {t.label}
                                <span className={cn("rounded-full px-1.5 text-xs tabular-nums", tab === t.value ? "bg-ink text-white" : "bg-ink/6")}>
                                    {countFor(t.value)}
                                </span>
                                <span aria-hidden className={cn("absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-ink transition-opacity", tab === t.value ? "opacity-100" : "opacity-0")} />
                            </button>
                        ))}
                    </div>

                    {visible.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
                            <p className="font-serif text-xl italic text-ink-muted">{tab !== "all" && EMPTY_TAB[tab]}</p>
                            <Button asChild variant="outline" className="mt-5">
                                <Link href="/explore">Find a book</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2" role="tabpanel">
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
                    {stats.topGenres.length > 0 && (
                        <div className="rounded-2xl border border-line bg-card p-6">
                            <h2 className="text-2xl text-ink">Your top genres</h2>
                            <ul className="mt-5 space-y-4">
                                {stats.topGenres.map(([genre, count]) => (
                                    <li key={genre} className="space-y-1.5">
                                        <div className="flex justify-between text-sm">
                                            <Link href={`/explore?genre=${encodeURIComponent(genre)}`} className="text-ink decoration-ink/30 underline-offset-4 hover:underline">{genre}</Link>
                                            <span className="tabular-nums text-ink-muted">{count}</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-ink/8">
                                            <div className="h-full rounded-full" style={{ width: `${(count / stats.maxGenre) * 100}%`, backgroundColor: genreColor(genre).bg }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="rounded-2xl bg-ink p-6 text-white">
                        <h2 className="text-2xl">Reading breakdown</h2>
                        <div className="mt-5 flex h-2 gap-0.5 overflow-hidden rounded-full bg-white/10">
                            {BREAKDOWN.map(({ status, color }) => (
                                <div
                                    key={status}
                                    title={`${STATUS_LABELS[status]}: ${stats.byStatus[status]}`}
                                    style={{ width: `${(stats.byStatus[status] / items.length) * 100}%`, backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <ul className="mt-5 space-y-2 text-sm text-white/75">
                            {BREAKDOWN.map(({ status, color }) => (
                                <li key={status} className="flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                                    {STATUS_LABELS[status]}
                                    <span className="ml-auto tabular-nums text-white">{stats.byStatus[status]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LibraryView;
