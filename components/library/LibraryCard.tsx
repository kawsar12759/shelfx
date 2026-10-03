"use client";
import { STATUS_LABELS } from "@/lib/genres";
import { cn, formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import BookCover from "../BookCover";

type LibraryCardProps = {
    entry: LibraryEntry;
    busy: boolean;
    onUpdate: (bookId: string, body: Partial<Pick<LibraryEntry, "status" | "currentPage">>) => void;
    onRemove: (entry: LibraryEntry) => void;
};

const STATUS_STYLES: Record<ReadingStatus, string> = {
    "want-to-read": "bg-ink/6 text-ink",
    reading: "bg-[#E3EAF7] text-[#1E3A8A]",
    finished: "bg-[#E2EFE4] text-[#14532D]",
};

const LibraryCard = ({ entry, busy, onUpdate, onRemove }: LibraryCardProps) => {
    const { book, status, currentPage } = entry;
    const [page, setPage] = useState(String(currentPage));
    const percent = book.pages ? Math.min(Math.round((currentPage / book.pages) * 100), 100) : 0;

    return (
        <article
            className={cn(
                "group/card flex gap-5 rounded-2xl border border-line bg-card p-4 transition-[border-color,box-shadow,opacity] duration-300 hover:border-ink/15 hover:shadow-lift",
                busy && "opacity-70"
            )}
        >
            <Link href={`/book/${book._id}`} className="w-20 shrink-0 self-start shadow-cover sm:w-24" tabIndex={-1} aria-hidden>
                <BookCover src={book.cover} title={book.title} sizes="96px" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-3 py-0.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <Link href={`/book/${book._id}`} className="font-serif text-xl leading-tight text-ink line-clamp-2 decoration-ink/30 underline-offset-4 hover:underline">
                            {book.title}
                        </Link>
                        <p className="mt-0.5 text-sm text-ink-muted line-clamp-1">{book.author}</p>
                    </div>
                    <button
                        type="button"
                        aria-label={`Remove ${book.title} from library`}
                        disabled={busy}
                        onClick={() => onRemove(entry)}
                        className="-mr-1 -mt-1 shrink-0 cursor-pointer rounded-full p-2 text-ink-faint transition-[color,background-color,opacity] hover:bg-red-50 hover:text-alert focus-visible:opacity-100 md:opacity-0 md:group-hover/card:opacity-100"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <label className="sr-only" htmlFor={`status-${entry._id}`}>Reading status</label>
                    <select
                        id={`status-${entry._id}`}
                        value={status}
                        disabled={busy}
                        onChange={(e) => onUpdate(book._id, { status: e.target.value as ReadingStatus })}
                        className={cn(
                            "select-chevron h-7 cursor-pointer rounded-full border-0 pl-3 text-xs font-semibold bg-position-[right_0.5rem_center]! bg-size-[0.85rem]! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "pr-7!",
                            STATUS_STYLES[status]
                        )}
                    >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    {status === "finished" && entry.finishedAt && (
                        <span className="text-xs text-ink-muted">Finished {formatDate(entry.finishedAt)}</span>
                    )}
                    {status === "want-to-read" && (
                        <span className="text-xs text-ink-muted">Added {formatDate(entry.createdAt)}</span>
                    )}
                </div>

                {status !== "want-to-read" && (
                    <div className="mt-auto space-y-2">
                        <div className="h-1 overflow-hidden rounded-full bg-ink/10">
                            <div
                                className={cn("h-full rounded-full transition-[width] duration-700 ease-out-soft", status === "finished" ? "bg-[#15803D]" : "bg-ink")}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        {status === "reading" ? (
                            <form
                                className="flex items-center gap-1.5 text-xs text-ink-muted"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onUpdate(book._id, { currentPage: Math.min(Math.max(Number(page) || 0, 0), book.pages) });
                                }}
                            >
                                <label htmlFor={`page-${entry._id}`}>Page</label>
                                <input
                                    id={`page-${entry._id}`}
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    max={book.pages}
                                    value={page}
                                    onChange={(e) => setPage(e.target.value)}
                                    className="h-7 w-16 rounded-md border border-input bg-white px-2 text-xs tabular-nums text-ink focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                                />
                                <span className="tabular-nums">of {book.pages} · {percent}%</span>
                                {page !== String(currentPage) && (
                                    <button type="submit" disabled={busy} className="ml-auto cursor-pointer rounded-full bg-ink px-3 py-1 font-semibold text-white transition-colors hover:bg-ink-strong animate-in fade-in zoom-in-95 duration-150">
                                        Save
                                    </button>
                                )}
                            </form>
                        ) : (
                            <p className="text-xs tabular-nums text-ink-muted">{book.pages} pages · 100%</p>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

export default LibraryCard;
