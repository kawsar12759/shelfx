import { Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { genreColor } from '@/lib/genres';

const BookCard = ({ _id, title, author, cover, genre, ratingAvg = 0, ratingCount = 0, readersCount = 0 }: Book) => {
    const mainGenre = genre?.[0];

    return (
        <Link href={`/book/${_id}`} className="group block h-full rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
            <article className="flex h-full flex-col">
                <div className="relative aspect-2/3 w-full overflow-hidden rounded-sm bg-stack shadow-[0_1px_2px_rgba(20,27,52,0.12),0_8px_20px_-12px_rgba(20,27,52,0.35)] transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transition-none">
                    <Image
                        src={cover}
                        alt={`Cover of ${title}`}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-1 flex-col gap-1 pt-3">
                    {mainGenre && (
                        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                            <span className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: genreColor(mainGenre).bg }} aria-hidden />
                            {mainGenre}
                        </p>
                    )}
                    <h3 className="text-xl leading-tight text-ink line-clamp-2 decoration-2 underline-offset-4 group-hover:underline">
                        {title}
                    </h3>
                    <p className="text-sm text-ink-muted line-clamp-1">{author}</p>
                    <div className="mt-auto flex items-center gap-3 pt-2 font-mono text-xs text-ink-muted">
                        <span className="flex items-center gap-1" title={ratingCount ? `${ratingCount} ratings` : "No ratings yet"}>
                            <Star className={`h-3.5 w-3.5 ${ratingCount ? "fill-signal text-signal" : "text-line"}`} />
                            {ratingCount ? (
                                <>
                                    <span className="font-medium text-ink">{ratingAvg.toFixed(1)}</span>
                                    <span>({ratingCount})</span>
                                </>
                            ) : (
                                "No ratings"
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
