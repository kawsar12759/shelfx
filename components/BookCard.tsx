import { Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BookCard = ({ _id, title, author, cover, genre, ratingAvg = 0, ratingCount = 0, readersCount = 0 }: Book) => {
    return (
        <Link href={`/book/${_id}`} className="group block h-full focus-visible:outline-none">
            <article className="flex h-full flex-col rounded-xl border border-transparent bg-white/70 p-3 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:border-line group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring">
                <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-paper shadow-sm">
                    <Image
                        src={cover}
                        alt={`Cover of ${title}`}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {genre?.[0] && (
                        <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2.5 py-0.5 text-[11px] font-semibold text-ink shadow-sm backdrop-blur">
                            {genre[0]}
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
                    <h3 className="font-serif text-lg font-bold leading-snug text-ink line-clamp-2 transition-colors duration-300 group-hover:text-wine">
                        {title}
                    </h3>
                    <p className="text-sm text-ink-muted line-clamp-1">{author}</p>
                    <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-ink-muted">
                        <span className="flex items-center gap-1" title={ratingCount ? `${ratingCount} ratings` : "No ratings yet"}>
                            <Star className={`h-3.5 w-3.5 ${ratingCount ? "fill-gold text-gold" : "text-[#C9B9A7]"}`} />
                            {ratingCount ? (
                                <>
                                    <span className="font-semibold text-ink">{ratingAvg.toFixed(1)}</span>
                                    <span>({ratingCount})</span>
                                </>
                            ) : (
                                "New"
                            )}
                        </span>
                        {readersCount > 0 && (
                            <span className="flex items-center gap-1" title={`On ${readersCount} shelves`}>
                                <Users className="h-3.5 w-3.5" />
                                {readersCount}
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default BookCard;
