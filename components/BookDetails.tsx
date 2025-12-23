import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, BookOpen, Globe, RefreshCcw, BookPlus } from "lucide-react";

const BookDetails = ({ title, author, cover, genre, summary, pages, language, addedBy, createdAt, updatedAt, }: Book) => {
    return (
        <section className="min-h-screen bg-gradient-to-b from-[#FAF7F3] via-[#F4EFE9] to-[#EFE7DE]">
            <div className="max-w-6xl mx-auto px-5 py-20 space-y-16">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-4 space-y-4">
                        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-xl">
                            <Image
                                src={cover}
                                alt={title}
                                fill
                                priority
                            />
                        </div>
                        <button
                            type="button"
                            className="
                            w-full flex items-center justify-center  gap-2
                            rounded-lg border border-[#D6C7B7]
                            bg-white/70 backdrop-blur
                            px-4 py-3 text-sm font-medium
                            text-[#6B4F3F] hover:cursor-pointer
                            hover:bg-[#6B4F3F] hover:text-white
                            active:scale-95 transition-all
                            "
                        >
                            <BookPlus className="w-4 h-4" />
                            Add to My Library
                        </button>
                    </div>

                    <div className="md:col-span-8 space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#6B4F3F]">
                                {title}
                            </h1>
                            <p className="text-lg text-[#847062] flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {author}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#847062]">
                            <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" /> {pages} pages
                            </span>
                            <span className="flex items-center gap-1">
                                <Globe className="w-4 h-4" /> {language}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Added on {new Date(createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <RefreshCcw className="w-4 h-4" />
                                Updated on {new Date(updatedAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {(Array.isArray(genre) ? genre : [genre]).map((g, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="bg-[#E6D8C8] text-[#6B4F3F] rounded-full px-3 py-1 text-xs"
                                >
                                    {g}
                                </Badge>
                            ))}
                        </div>

                        <div className="h-px bg-[#DAD3C8]/70 w-full" />

                        <div className="space-y-3 max-w-3xl">
                            <h2 className="text-lg font-semibold text-[#6B4F3F]">
                                About this book
                            </h2>
                            <p className="text-[#847062] leading-relaxed text-base">
                                {summary}
                            </p>
                        </div>
                        <div className="h-px bg-[#DAD3C8]/70 w-full" />
                        {addedBy && (
                            <p className="text-sm text-[#847062] italic pt-2">
                                Added by <span className="font-semibold">{addedBy.firstName}</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookDetails;
