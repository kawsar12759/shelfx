"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import BookCard from '../BookCard';

const RecentlyAdded = () => {
    const [recentBooks, setRecentBooks] = useState<Array<Book>>([]);

    useEffect(() => {
        const fetchRecentBooks = async () => {
            try {
                const response = await axios.get("/api/books");
                const data = response.data;
                setRecentBooks(data.books.slice(0, 6));
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchRecentBooks();
    }, []);

    if (recentBooks.length === 0) {
        return (
            <div className="py-24 px-6 min-h-screen flex flex-col items-center justify-center text-[#847062]">
                <Loader2 className="animate-spin text-2xl mb-4" />
                <p className="text-lg font-medium">Loading Books...</p>
            </div>
        );
    }

    return (
        <section className="relative py-16 px-4 bg-gradient-to-b from-[#FAF7F3]/50 via-[#F4EFE9]/50 to-[#EFE7DE]/50 backdrop-blur-sm border-t border-[#DAD3C8]">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10">
                    <h2 className="text-4xl font-extrabold text-[#6B4F3F] mb-4 md:mb-0">Recently Added</h2>
                    <Button
                        variant="outline"
                        asChild
                        className="rounded-full px-6 py-2 text-[#6B4F3F] hover:bg-[#E6D8C8]/20 hover:text-[#6B4F3F] transition-colors active:scale-95"
                    >
                        <Link href="/explore" className="flex items-center gap-2">
                            View All <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {recentBooks.map((book) => (
                        <div
                            key={book._id}
                            className="bg-white/70 backdrop-blur-md rounded-2xl"
                        >
                            <BookCard {...book} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyAdded;
