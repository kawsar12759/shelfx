"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Funnel, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import BookCard from '../../../components/BookCard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const popularGenres = [
    "All", "Classic", "Fiction", "Romance", "Drama", "Gothic", "Dystopian",
    "Adventure", "Poetry", "Mystery", "Fantasy", "History", "Science Fiction",
    "Thriller", "Horror", "Non-Fiction", "Biography", "Philosophy",
    "Psychology", "Self-Help",
] as const;

const ExplorePage = () => {
    const searchParams = useSearchParams();
    const [selectedGenre, setSelectedGenre] = useState(() => {
        const gp = searchParams.get("genre");
        return gp ? gp.replace(/^\"(.*)\"$/, "$1") : "All";
    });

    const [books, setBooks] = useState<Array<Book>>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname();

    const handleGenreClick = (genre: string) => {
        setSelectedGenre(genre);
        router.push(`${pathname}?genre=\"${genre}\"`);
    };

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const genreQuery =
                    selectedGenre !== "All"
                        ? `?genre=${encodeURIComponent(`"${selectedGenre}"`)}`
                        : "";
                const response = await axios.get(`/api/books${genreQuery}`);
                setBooks(response.data.books);
            } catch {
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [selectedGenre]);

    return (
        <section className="min-h-screen bg-gradient-to-b from-[#FAF7F3] via-[#F4EFE9] to-[#EFE7DE]">
            <div className="max-w-7xl mx-auto px-5 py-16 space-y-14">

                <header className=" space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#6B4F3F]">
                        Explore the Library
                    </h1>
                    <p className="text-lg text-[#847062] leading-relaxed">
                        Explore books from every genre, era, and style—carefully curated for readers who love to dive into stories.
                    </p>
                </header>

                <section className="space-y-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#6B4F3F]">
                        <Funnel className="w-4 h-4" />
                        <span>Browse by genre</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {popularGenres.map((genre) => (
                            <Button
                                key={genre}
                                size="sm"
                                onClick={() => handleGenreClick(genre)}
                                variant={selectedGenre === genre ? "default" : "outline"}
                                className={`
                                    rounded-full px-5 font-medium cursor-pointer
                                    ${selectedGenre === genre
                                        ? "bg-[#6B4F3F] text-white hover:bg-[#5a3f33]"
                                        : "border-[#DAD3C8] text-[#6B4F3F] hover:bg-[#E6D8C8]/40"}
                                `}
                            >
                                {genre}
                            </Button>
                        ))}
                    </div>
                </section>

                <div className="text-sm text-[#847062]">
                    {loading ? "Loading titles…" : `${books.length} titles available`}
                </div>

                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center text-[#847062]">
                        <Loader2 className="animate-spin w-9 h-9 mb-4" />
                        <p className="text-base">Fetching the collection</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                        {books.map((book) => (
                            <BookCard key={book._id} {...book} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ExplorePage;
