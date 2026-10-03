import { Star } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { genreColor } from '@/lib/genres';
import BookCover from './BookCover';

const BookCard = ({ _id, title, author, cover, genre, ratingAvg = 0, ratingCount = 0, readersCount = 0 }: Book) => {
    const mainGenre = genre?.[0];

    return (
        <Link href={`/book/${_id}`} className="group block h-full rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
            <article className="flex h-full flex-col">
                <div className="shadow-cover transition-[transform,box-shadow] duration-500 ease-out-soft group-hover:-translate-y-1.5 group-hover:shadow-cover-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                    <BookCover
                        src={cover}
                        title={title}
                        sizes="(min-width: 1280px) 280px, (min-width: 768px) 30vw, 45vw"
                    />
                </div>

                <div className="flex flex-1 flex-col pt-4">
                    {mainGenre && (
                        <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: genreColor(mainGenre).bg }} aria-hidden />
                            {mainGenre}
                        </p>
                    )}
                    <h3 className="font-serif text-[1.3rem] leading-[1.15] text-ink line-clamp-2">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted line-clamp-1">{author}</p>
                    <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-ink-muted">
                        {ratingCount ? (
                            <>
                                <Star className="h-3.5 w-3.5 fill-signal text-signal" aria-hidden />
                                <span className="font-semibold tabular-nums text-ink">{ratingAvg.toFixed(1)}</span>
                                <span className="tabular-nums">· {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}</span>
                            </>
                        ) : (
                            <span>Not yet rated</span>
                        )}
                        {readersCount > 0 && (
                            <span className="ml-auto tabular-nums" title={`On ${readersCount} ${readersCount === 1 ? "shelf" : "shelves"}`}>
                                {readersCount} {readersCount === 1 ? "reader" : "readers"}
                            </span>
                        )}
                    </p>
                </div>
            </article>
        </Link>
    );
};

export default BookCard;
