"use client";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "@/lib/genres";
import { cn } from "@/lib/utils";
import { SignInButton, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BookmarkPlus, BookOpenCheck, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Entry = Pick<LibraryEntry, "status" | "currentPage">;

const STATUS_ORDER: ReadingStatus[] = ["want-to-read", "reading", "finished"];

/** Shelf controls on the book page: add to library, change status, log progress. */
const LibraryControls = ({ bookId, totalPages }: { bookId: string; totalPages: number }) => {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
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
            toast.success(`Added to “${STATUS_LABELS[status]}” 📚`);
        } catch {
            toast.error("Couldn't add this book. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    const update = async (body: Partial<Entry>, message: string) => {
        setBusy(true);
        try {
            const res = await axios.patch(`/api/library/${bookId}`, body);
            applyEntry(res.data.entry);
            toast.success(message);
        } catch {
            toast.error("Couldn't update your shelf.");
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        setBusy(true);
        try {
            await axios.delete(`/api/library/${bookId}`);
            setEntry(null);
            setPageInput("");
            router.refresh();
            toast.info("Removed from your library");
        } catch {
            toast.error("Couldn't remove this book.");
        } finally {
            setBusy(false);
        }
    };

    if (!isLoaded || checking) {
        return (
            <div className="flex h-24 items-center justify-center rounded-xl border border-line bg-white/60">
                <Loader2 className="h-5 w-5 animate-spin text-ink-muted" />
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="space-y-2 rounded-xl border border-line bg-white/70 p-4 text-center">
                <p className="text-sm text-ink-muted">Keep track of this book on your shelf.</p>
                <SignInButton mode="modal">
                    <Button className="w-full cursor-pointer">
                        <BookmarkPlus className="h-4 w-4" /> Sign in to add
                    </Button>
                </SignInButton>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="space-y-2 rounded-xl border border-line bg-white/70 p-4">
                <Button className="w-full cursor-pointer" size="lg" disabled={busy} onClick={() => addToLibrary("want-to-read")}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookmarkPlus className="h-4 w-4" />}
                    Add to Want to Read
                </Button>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="cursor-pointer" disabled={busy} onClick={() => addToLibrary("reading")}>
                        <BookOpenCheck className="h-4 w-4" /> Reading
                    </Button>
                    <Button variant="outline" size="sm" className="cursor-pointer" disabled={busy} onClick={() => addToLibrary("finished")}>
                        <CheckCircle2 className="h-4 w-4" /> Finished
                    </Button>
                </div>
            </div>
        );
    }

    const percent = totalPages ? Math.round((entry.currentPage / totalPages) * 100) : 0;

    return (
        <div className="space-y-4 rounded-xl border border-line bg-white/70 p-4">
            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">On your shelf</p>
                <div className="grid grid-cols-3 gap-1 rounded-lg bg-secondary p-1" role="radiogroup" aria-label="Reading status">
                    {STATUS_ORDER.map((s) => (
                        <button
                            key={s}
                            type="button"
                            role="radio"
                            aria-checked={entry.status === s}
                            disabled={busy}
                            onClick={() => entry.status !== s && update({ status: s }, `Moved to “${STATUS_LABELS[s]}”`)}
                            className={cn(
                                "cursor-pointer rounded-md px-1 py-1.5 text-xs font-medium transition-colors disabled:cursor-wait",
                                entry.status === s ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
                            )}
                        >
                            {s === "want-to-read" ? "Want to Read" : s === "reading" ? "Reading" : "Finished"}
                        </button>
                    ))}
                </div>
            </div>

            {entry.status !== "want-to-read" && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-ink-muted">
                        <span>Progress</span>
                        <span className="font-semibold text-ink">{percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-sand/70">
                        <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    {entry.status === "reading" && (
                        <form
                            className="flex items-center gap-2 pt-1"
                            onSubmit={(e) => {
                                e.preventDefault();
                                update({ currentPage: Number(pageInput) }, "Progress saved");
                            }}
                        >
                            <label htmlFor="current-page" className="text-xs text-ink-muted">Page</label>
                            <input
                                id="current-page"
                                type="number"
                                min={0}
                                max={totalPages}
                                value={pageInput}
                                onChange={(e) => setPageInput(e.target.value)}
                                className="h-8 w-20 rounded-md border border-input bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <span className="text-xs text-ink-muted">of {totalPages}</span>
                            <Button type="submit" size="sm" variant="outline" className="ml-auto cursor-pointer" disabled={busy}>
                                Save
                            </Button>
                        </form>
                    )}
                </div>
            )}

            <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-wine"
            >
                <Trash2 className="h-3.5 w-3.5" /> Remove from library
            </button>
        </div>
    );
};

export default LibraryControls;
