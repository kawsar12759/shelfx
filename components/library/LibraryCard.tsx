"use client";
import { STATUS_LABELS } from "@/lib/genres";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type LibraryCardProps = {
    entry: LibraryEntry;
    busy: boolean;
    onUpdate: (bookId: string, body: Partial<Pick<LibraryEntry, "status" | "currentPage">>) => void;
    onRemove: (entry: LibraryEntry) => void;
};

const STATUS_STYLES: Record<ReadingStatus, string> = {
    "want-to-read": "bg-stack text-ink",
    reading: "bg-[#DCE5F5] text-[#1E3A8A]",
    finished: "bg-[#DDEBDF] text-[#14532D]",
};

const LibraryCard = ({ entry, busy, onUpdate, onRemove }: LibraryCardProps) => {
    const { book, status, currentPage } = entry;
    const [page, setPage] = useState(String(currentPage));
    const percent = book.pages ? Math.round((currentPage / book.pages) * 100) : 0;

    return (
        <article className="flex gap-4 rounded-md border border-line/80 bg-card p-4 transition-shadow hover:shadow-md">
            <Link href={`/book/${book._id}`} className="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-md shadow-sm sm:w-24">
                <Image src={book.cover} alt={`Cover of ${book.title}`} fill sizes="96px" className="object-cover" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <Link href={`/book/${book._id}`} className="font-condensed text-xl font-extrabold leading-tight text-ink line-clamp-2 underline-offset-4 hover:underline">
                            {book.title}
                        </Link>
                        <p className="text-sm text-ink-muted line-clamp-1">{book.author}</p>
                    </div>
                    <button
                        type="button"
                        aria-label={`Remove ${book.title} from library`}
                        disabled={busy}
                        onClick={() => onRemove(entry)}
                        className="shrink-0 cursor-pointer rounded-md p-1.5 text-ink-muted transition-colors hover:bg-red-50 hover:text-alert"
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
                        className={`cursor-pointer rounded-sm border-0 py-1 pl-3 pr-7 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${STATUS_STYLES[status]}`}
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
                    <div className="mt-auto space-y-1.5">
                        <div className="h-1.5 overflow-hidden rounded-sm bg-stack/70">
                            <div
                                className={`h-full rounded-sm transition-all duration-500 ${status === "finished" ? "bg-[#15803D]" : "bg-ink"}`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        {status === "reading" ? (
                            <form
                                className="flex items-center gap-1.5 text-xs text-ink-muted"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onUpdate(book._id, { currentPage: Number(page) });
                                }}
                            >
                                <label htmlFor={`page-${entry._id}`}>Page</label>
                                <input
                                    id={`page-${entry._id}`}
                                    type="number"
                                    min={0}
                                    max={book.pages}
                                    value={page}
                                    onChange={(e) => setPage(e.target.value)}
                                    className="h-7 w-16 rounded-md border border-input bg-white px-1.5 text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <span>of {book.pages} · {percent}%</span>
                                {page !== String(currentPage) && (
                                    <button type="submit" disabled={busy} className="ml-auto cursor-pointer rounded-md bg-ink px-2 py-1 font-semibold text-white hover:bg-ink-strong">
                                        Save
                                    </button>
                                )}
                            </form>
                        ) : (
                            <p className="text-xs text-ink-muted">{book.pages} pages · 100%</p>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

export default LibraryCard;
