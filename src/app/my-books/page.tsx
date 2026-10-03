"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { formatDate } from "@/lib/utils";
import { genreColor } from "@/lib/genres";
import { useConfirm } from "../../../components/ConfirmDialog";
import BookCover from "../../../components/BookCover";
import { Shimmer } from "../../../components/BookCardSkeleton";
import SectionHeader from "../../../components/SectionHeader";

const MyBooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { isLoaded, isSignedIn, userId } = useAuth();
    const confirm = useConfirm();

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn || !userId) {
            setBooks([]);
            setLoading(false);
            return;
        }
        axios
            .get("/api/books/my-books")
            .then((res) => setBooks(res.data.books ?? []))
            .catch(() => toast.error("Couldn't load your books. Refresh to try again."))
            .finally(() => setLoading(false));
    }, [isLoaded, isSignedIn, userId]);

    const handleDelete = async (book: Book) => {
        const ok = await confirm({
            title: `Delete “${book.title}”?`,
            description: "The book, its reviews and every reader's shelf entry for it will be permanently deleted. This can't be undone.",
            confirmLabel: "Delete book",
            tone: "danger",
        });
        if (!ok) return;

        setDeletingId(book._id);
        try {
            await axios.delete(`/api/books/delete/${book._id}`);
            setBooks((prev) => prev.filter((b) => b._id !== book._id));
            toast.info("Book deleted");
        } catch {
            toast.error("Couldn't delete the book. Try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section className="mx-auto max-w-5xl space-y-10 px-5 pt-12 md:pt-16">
            <div className="flex flex-col justify-between gap-6 border-b border-line pb-10 sm:flex-row sm:items-end">
                <SectionHeader
                    as="h1"
                    title="Books you've added"
                    subtitle={
                        loading
                            ? "Edit the details of books you added, or remove them."
                            : `${books.length} ${books.length === 1 ? "book" : "books"} you've shared with other readers.`
                    }
                />
                <Button asChild className="shrink-0 self-start sm:self-auto">
                    <Link href="/add-book"><Plus /> Add a book</Link>
                </Button>
            </div>

            {loading ? (
                <ul className="divide-y divide-line" aria-busy aria-label="Loading your books">
                    {Array.from({ length: 3 }, (_, i) => (
                        <li key={i} className="flex gap-5 py-5">
                            <Shimmer className="h-24 w-16 shrink-0" />
                            <div className="flex-1 space-y-2.5 pt-1">
                                <Shimmer className="h-5 w-1/2" />
                                <Shimmer className="h-4 w-1/3" />
                                <Shimmer className="h-3 w-1/4" />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : books.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-line bg-card px-6 py-20 text-center">
                    <h2 className="text-4xl text-ink">Nothing added yet</h2>
                    <p className="mt-3 max-w-md text-ink-muted">
                        Know a book that isn&apos;t on ShelfX? Add it with a cover and summary, and any reader can shelve it.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="/add-book"><Plus /> Add your first book</Link>
                    </Button>
                </div>
            ) : (
                <ul className="divide-y divide-line">
                    {books.map((book) => {
                        const genres = (Array.isArray(book.genre) ? book.genre : [book.genre]).filter(Boolean);
                        const deleting = deletingId === book._id;
                        return (
                            <li
                                key={book._id}
                                className={`group/row flex items-center gap-5 py-5 transition-opacity ${deleting ? "pointer-events-none opacity-50" : ""}`}
                            >
                                <Link href={`/book/${book._id}`} className="w-16 shrink-0 shadow-cover" tabIndex={-1} aria-hidden>
                                    <BookCover src={book.cover} title={book.title} sizes="64px" />
                                </Link>

                                <div className="min-w-0 flex-1">
                                    <Link href={`/book/${book._id}`} className="font-serif text-xl leading-tight text-ink line-clamp-1 decoration-ink/30 underline-offset-4 hover:underline">
                                        {book.title}
                                    </Link>
                                    <p className="text-sm text-ink-muted line-clamp-1">{book.author}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                                        <span className="flex items-center gap-1">
                                            {book.ratingCount ? (
                                                <>
                                                    <Star className="h-3.5 w-3.5 fill-signal text-signal" aria-hidden />
                                                    <span className="font-semibold tabular-nums text-ink">{book.ratingAvg?.toFixed(1)}</span>
                                                    <span className="tabular-nums">({book.ratingCount})</span>
                                                </>
                                            ) : (
                                                "Not yet rated"
                                            )}
                                        </span>
                                        <span className="tabular-nums">{book.readersCount ?? 0} on shelves</span>
                                        <span className="hidden sm:inline">Added {formatDate(book.createdAt)}</span>
                                        <span className="hidden items-center gap-2 md:flex">
                                            {genres.map((g) => (
                                                <span key={g} className="flex items-center gap-1">
                                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: genreColor(g).bg }} aria-hidden />
                                                    {g}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-1">
                                    <Button size="sm" variant="ghost" asChild className="h-9">
                                        <Link href={`/edit-book/${book._id}`} aria-label={`Edit ${book.title}`}>
                                            <Pencil /> <span className="hidden sm:inline">Edit</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-9 w-9 text-ink-muted hover:bg-red-50 hover:text-alert"
                                        onClick={() => handleDelete(book)}
                                        aria-label={`Delete ${book.title}`}
                                    >
                                        {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                                    </Button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

export default MyBooksPage;
