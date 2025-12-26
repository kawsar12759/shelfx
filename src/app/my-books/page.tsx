"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";


const MyBooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const { isLoaded, isSignedIn, userId, getToken } = useAuth();
    const handleDeleteBook = async (bookId: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This book will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#7C2D12",
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
        console.log(userId);

        const fetchMyBooks = async () => {
            try {
                console.log('after', userId);
                setLoading(true);

                const token = await getToken();
                if (!token) throw new Error("No token");

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
    }, [isLoaded, isSignedIn, userId, getToken]);


    return (
        <section className="min-h-screen bg-gradient-to-b from-[#FAF7F3] via-[#F4EFE9] to-[#EFE7DE]">
            <div className="max-w-7xl mx-auto px-5 py-16 space-y-12">
                <header className="max-w-3xl space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#6B4F3F]">
                        Your Added Books
                    </h1>
                    <p className="text-[#847062] text-lg leading-relaxed">
                        Manage the books you’ve added to ShelfX. Edit details or remove entries anytime.
                    </p>
                </header>

                {loading ? (
                    <div className="py-32 flex flex-col items-center text-[#847062]">
                        <Loader2 className="animate-spin w-8 h-8 mb-4" />
                        <p>Loading your books…</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="py-24 text-center text-[#847062]">
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
                    <div className="overflow-x-auto rounded-xl border border-[#DAD3C8] bg-white/70 backdrop-blur">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-sm text-[#6B4F3F] bg-[#F4EFE9]">
                                    <th className="px-4 py-3 font-semibold">Book</th>
                                    <th className="px-4 py-3 font-semibold">Author</th>
                                    <th className="px-4 py-3 font-semibold hidden md:table-cell">Genres</th>
                                    <th className="px-4 py-3 font-semibold hidden lg:table-cell">Added</th>
                                    <th className="px-4 py-3 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E6D8C8]">
                                {books.map((book) => (
                                    <tr
                                        key={book._id}
                                        className="hover:bg-[#FAF7F3]/60 transition-colors"
                                    >
                                        {/* Book */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-24 shrink-0 rounded overflow-hidden bg-[#FAF7F3]">
                                                    <Image
                                                        src={book.cover}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="max-w-xs">
                                                    <p className="font-semibold text-[#6B4F3F] line-clamp-2">
                                                        {book.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Author */}
                                        <td className="px-4 py-4 text-sm text-[#847062]">
                                            {book.author}
                                        </td>

                                        {/* Genres */}
                                        <td className="px-4 py-4 hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1.5">
                                                {(Array.isArray(book.genre) ? book.genre : [book.genre]).map(
                                                    (g, i) => (
                                                        <Badge
                                                            key={i}
                                                            className="bg-[#E6D8C8] text-[#6B4F3F] text-xs rounded-full"
                                                        >
                                                            {g}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </td>

                                        {/* Added */}
                                        <td className="px-4 py-4 text-sm text-[#847062] hidden lg:table-cell">
                                            {new Date(book.createdAt).toLocaleDateString()}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                    className="cursor-pointer active:scale-95  gap-1 text-[#6B4F3F]"
                                                >
                                                    <Link href={`/edit-book/${book._id}`}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="gap-1 active:scale-95 cursor-pointer"
                                                    onClick={() => handleDeleteBook(book._id)}
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
