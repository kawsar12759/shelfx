"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Loader2, Plus, Eye, Star, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { formatDate } from "@/lib/utils";


const MyBooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const { isLoaded, isSignedIn, userId } = useAuth();
    const handleDeleteBook = async (bookId: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This book, its reviews and every shelf entry for it will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B42318",
            cancelButtonColor: "#9CA3AF",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`/api/books/delete/${bookId}`, {
                withCredentials: true,
            });
            setBooks((prev) => prev.filter((b) => b._id !== bookId));
            Swal.fire({
                title: "Deleted!",
                text: "The book has been deleted successfully.",
                icon: "success",
                timer: 1800,
                showConfirmButton: false,
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Failed to delete the book. Please try again.",
                icon: "error",
            });
        }
    };
    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn || !userId) {
            setBooks([]);
            setLoading(false);
            return;
        }
        const fetchMyBooks = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/books/my-books", { withCredentials: true });

                setBooks(res.data.books ?? []);
            } catch (err) {
                console.error(err);
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMyBooks();
    }, [isLoaded, isSignedIn, userId]);


    return (
        <section className="min-h-screen">
            <div className="max-w-7xl mx-auto px-5 py-16 space-y-12">
                <header className="space-y-3 border-b border-line pb-8">
                    <h1 className="text-5xl leading-none text-ink md:text-6xl">
                        Books you&apos;ve added
                    </h1>
                    <p className="max-w-2xl text-ink-muted text-lg leading-relaxed">
                        Edit the details of books you added, or delete them. Deleting a book also removes its reviews and shelf entries.
                    </p>
                </header>

                {loading ? (
                    <div className="py-32 flex flex-col items-center text-ink-muted">
                        <Loader2 className="animate-spin w-8 h-8 mb-4" />
                        <p>Loading your books…</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="py-24 text-center text-ink-muted">
                        <p className="text-lg font-medium">You haven’t added any books yet.</p>
                        <div className="flex justify-center mt-3">
                            <Button asChild>
                                <Link href="/add-book">
                                    <Plus className="w-5 h-5 mr-1" />
                                    Add a Book
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-md border border-line bg-card">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-sm text-ink bg-stack">
                                    <th className="px-4 py-3 font-semibold">Book</th>
                                    <th className="px-4 py-3 font-semibold">Author</th>
                                    <th className="px-4 py-3 font-semibold hidden md:table-cell">Genres</th>
                                    <th className="px-4 py-3 font-semibold hidden sm:table-cell">Rating</th>
                                    <th className="px-4 py-3 font-semibold hidden lg:table-cell">Added</th>
                                    <th className="px-4 py-3 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stack">
                                {books.map((book) => (
                                    <tr
                                        key={book._id}
                                        className="hover:bg-stack/40 transition-colors"
                                    >
                                        {/* Book */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-24 shrink-0 rounded overflow-hidden bg-stack">
                                                    <Image
                                                        src={book.cover}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="max-w-xs">
                                                    <Link href={`/book/${book._id}`} className="font-semibold text-ink line-clamp-2 hover:underline">
                                                        {book.title}
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Author */}
                                        <td className="px-4 py-4 text-sm text-ink-muted">
                                            {book.author}
                                        </td>

                                        {/* Genres */}
                                        <td className="px-4 py-4 hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1.5">
                                                {(Array.isArray(book.genre) ? book.genre : [book.genre]).map(
                                                    (g, i) => (
                                                        <Badge
                                                            key={i}
                                                            className="bg-stack text-ink text-xs rounded-sm font-normal"
                                                        >
                                                            {g}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </td>

                                        {/* Rating + readers */}
                                        <td className="px-4 py-4 text-sm text-ink-muted hidden sm:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1">
                                                    <Star className={`w-3.5 h-3.5 ${book.ratingCount ? "fill-signal text-signal" : ""}`} />
                                                    {book.ratingCount ? `${book.ratingAvg?.toFixed(1)} (${book.ratingCount})` : "—"}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs">
                                                    <Users className="w-3.5 h-3.5" /> {book.readersCount ?? 0} shelved
                                                </span>
                                            </div>
                                        </td>

                                        {/* Added */}
                                        <td className="px-4 py-4 text-sm text-ink-muted hidden lg:table-cell">
                                            {formatDate(book.createdAt)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    asChild
                                                    className="text-ink"
                                                >
                                                    <Link href={`/book/${book._id}`} aria-label={`View ${book.title}`}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                    className="cursor-pointer active:scale-95  gap-1 text-ink"
                                                >
                                                    <Link href={`/edit-book/${book._id}`} aria-label={`Edit ${book.title}`}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="gap-1 active:scale-95 cursor-pointer"
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    aria-label={`Delete ${book.title}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}
            </div>
        </section>
    );
};

export default MyBooksPage;
