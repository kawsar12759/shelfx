"use client";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "@/lib/genres";
import { cn } from "@/lib/utils";
import { SignInButton, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BookmarkPlus, BookOpen, Check, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useConfirm } from "../ConfirmDialog";
import { Shimmer } from "../BookCardSkeleton";

type Entry = Pick<LibraryEntry, "status" | "currentPage">;

const STATUS_ORDER: ReadingStatus[] = ["want-to-read", "reading", "finished"];
const SHORT_LABELS: Record<ReadingStatus, string> = { "want-to-read": "Want to read", reading: "Reading", finished: "Finished" };

const Panel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("rounded-2xl border border-line bg-card p-4 shadow-soft", className)}>{children}</div>
);

/** Shelf controls on the book page: add to library, change status, log progress. */
const LibraryControls = ({ bookId, title, totalPages }: { bookId: string; title: string; totalPages: number }) => {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const confirm = useConfirm();
    const [entry, setEntry] = useState<Entry | null>(null);
    const [checking, setChecking] = useState(true);
    const [busy, setBusy] = useState(false);
    const [pageInput, setPageInput] = useState("");

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            setChecking(false);
            return;
        }
        axios
            .get(`/api/library/status/${bookId}`)
            .then((res) => {
                const e = res.data.entry;
                if (e) {
                    setEntry({ status: e.status ?? "want-to-read", currentPage: e.currentPage ?? 0 });
                    setPageInput(String(e.currentPage ?? 0));
                }
            })
            .catch(() => setEntry(null))
            .finally(() => setChecking(false));
    }, [bookId, isLoaded, isSignedIn]);

    const applyEntry = (e: Entry) => {
        setEntry({ status: e.status, currentPage: e.currentPage });
        setPageInput(String(e.currentPage));
    };

    const addToLibrary = async (status: ReadingStatus) => {
        setBusy(true);
        try {
            const res = await axios.post("/api/library/add", { bookId, status });
            applyEntry(res.data.entry);
            router.refresh(); // update the "On shelves" count
            toast.success(`Added to ${STATUS_LABELS[status]}`);
        } catch {
            toast.error("Couldn't add this book. Check your connection and try again.");
        } finally {
            setBusy(false);
        }
    };

    const update = async (body: Partial<Entry>, message: string) => {
        setBusy(true);
        try {
            const res = await axios.patch(`/api/library/${bookId}`, body);
            applyEntry(res.data.entry);
            // Logging the last page finishes the book on the server; say so
            toast.success(res.data.entry.status === "finished" && body.status !== "finished" ? "Finished. Nicely done." : message);
        } catch {
            toast.error("Couldn't update your shelf. Try again.");
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        const ok = await confirm({
            title: "Remove from your library?",
            description: `“${title}” and your reading progress will be taken off your shelf.`,
            confirmLabel: "Remove",
            tone: "danger",
        });
        if (!ok) return;

        setBusy(true);
        try {
            await axios.delete(`/api/library/${bookId}`);
            setEntry(null);
            setPageInput("");
            router.refresh();
            toast.info("Removed from your library");
        } catch {
            toast.error("Couldn't remove this book. Try again.");
        } finally {
            setBusy(false);
        }
    };

    if (!isLoaded || checking) {
        return (
            <Panel className="space-y-2">
                <Shimmer className="h-12 rounded-full" />
                <Shimmer className="h-9 rounded-full" />
            </Panel>
        );
    }

    if (!isSignedIn) {
        return (
            <Panel className="space-y-3 text-center">
                <p className="text-sm text-ink-muted">Keep this book on your shelf and track your progress.</p>
                <SignInButton mode="modal">
                    <Button size="lg" className="w-full">
                        <BookmarkPlus /> Sign in to add
                    </Button>
                </SignInButton>
            </Panel>
        );
    }

    if (!entry) {
        return (
            <Panel className="space-y-2">
                <Button className="w-full" size="lg" disabled={busy} onClick={() => addToLibrary("want-to-read")}>
                    {busy ? <Loader2 className="animate-spin" /> : <BookmarkPlus />}
                    Want to read
                </Button>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-9" disabled={busy} onClick={() => addToLibrary("reading")}>
                        <BookOpen /> Reading
                    </Button>
                    <Button variant="outline" size="sm" className="h-9" disabled={busy} onClick={() => addToLibrary("finished")}>
                        <Check /> Finished
                    </Button>
                </div>
            </Panel>
        );
    }

    const percent = totalPages ? Math.min(Math.round((entry.currentPage / totalPages) * 100), 100) : 0;

    return (
        <Panel className="space-y-5">
            <div>
                <div className="mb-2.5 flex items-center justify-between">
                    <p className="eyebrow">On your shelf</p>
                    {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-muted" aria-label="Saving" />}
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-full bg-ink/6 p-1" role="radiogroup" aria-label="Reading status">
                    {STATUS_ORDER.map((s) => (
                        <button
                            key={s}
                            type="button"
                            role="radio"
                            aria-checked={entry.status === s}
                            disabled={busy}
                            onClick={() => entry.status !== s && update({ status: s }, `Moved to ${STATUS_LABELS[s]}`)}
                            className={cn(
                                "cursor-pointer rounded-full px-1 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-wait",
                                entry.status === s ? "bg-white text-ink shadow-soft" : "text-ink-muted hover:text-ink"
                            )}
                        >
                            {SHORT_LABELS[s]}
                        </button>
                    ))}
                </div>
            </div>

            {entry.status !== "want-to-read" && (
                <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                        <span className="text-xs text-ink-muted">Progress</span>
                        <span className="font-serif text-xl tabular-nums text-ink">{percent}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress">
                        <div
                            className={cn("h-full rounded-full transition-[width] duration-700 ease-out-soft", entry.status === "finished" ? "bg-[#15803D]" : "bg-ink")}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    {entry.status === "reading" && (
                        <form
                            className="flex items-center gap-2 pt-1"
                            onSubmit={(e) => {
                                e.preventDefault();
                                update({ currentPage: Math.min(Math.max(Number(pageInput) || 0, 0), totalPages) }, "Progress saved");
                            }}
                        >
                            <label htmlFor="current-page" className="text-xs text-ink-muted">Page</label>
                            <input
                                id="current-page"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={totalPages}
                                value={pageInput}
                                onChange={(e) => setPageInput(e.target.value)}
                                className="h-9 w-20 rounded-lg border border-input bg-white px-2.5 text-sm tabular-nums text-ink transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                            />
                            <span className="text-xs text-ink-muted">of {totalPages}</span>
                            <Button
                                type="submit"
                                size="sm"
                                className="ml-auto h-9"
                                disabled={busy || pageInput === String(entry.currentPage)}
                            >
                                Save
                            </Button>
                        </form>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between border-t border-line pt-3">
                {entry.status === "reading" ? (
                    <button
                        type="button"
                        onClick={() => update({ status: "finished" }, "Finished. Nicely done.")}
                        disabled={busy}
                        className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-ink transition-colors hover:text-[#15803D]"
                    >
                        <Check className="h-3.5 w-3.5" /> Mark finished
                    </button>
                ) : (
                    <span />
                )}
                <button
                    type="button"
                    onClick={remove}
                    disabled={busy}
                    className="cursor-pointer text-xs text-ink-muted transition-colors hover:text-alert"
                >
                    Remove
                </button>
            </div>
        </Panel>
    );
};

export default LibraryControls;
