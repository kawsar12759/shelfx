import Link from "next/link";
import { ChevronRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { genreColor } from "@/lib/genres";
import BookCard from "./BookCard";
import BookCover from "./BookCover";
import { BOOK_GRID } from "./BookCardSkeleton";
import SectionHeader from "./SectionHeader";
import StarRating from "./StarRating";
import LibraryControls from "./book/LibraryControls";
import Reviews from "./book/Reviews";

type BookDetailsProps = {
    book: Book;
    similar: Book[];
    isOwner: boolean;
};

const BookDetails = ({ book, similar, isOwner }: BookDetailsProps) => {
    const { _id, title, author, cover, genre, summary, pages, language, publishedYear, addedBy, createdAt } = book;
    const ratingAvg = book.ratingAvg ?? 0;
    const ratingCount = book.ratingCount ?? 0;
    const readersCount = book.readersCount ?? 0;
    const genres = (Array.isArray(genre) ? genre : [genre]).filter(Boolean);
    const mainGenre = genres[0];

    const facts = [
        { label: "Pages", value: pages?.toLocaleString("en-US") },
        { label: "Published", value: publishedYear },
        { label: "Language", value: language },
        { label: "On shelves", value: readersCount.toLocaleString("en-US") },
    ];

    return (
        <article>
            <div className="mx-auto max-w-6xl px-5 pt-8 md:pt-10">
                <nav aria-label="Breadcrumb" className="mb-8 md:mb-12">
                    <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
                        <li><Link href="/explore" className="transition-colors hover:text-ink">Explore</Link></li>
                        {mainGenre && (
                            <>
                                <ChevronRight className="h-3.5 w-3.5 text-ink-faint" aria-hidden />
                                <li>
                                    <Link href={`/explore?genre=${encodeURIComponent(mainGenre)}`} className="transition-colors hover:text-ink">
                                        {mainGenre}
                                    </Link>
                                </li>
                            </>
                        )}
                        <ChevronRight className="h-3.5 w-3.5 text-ink-faint" aria-hidden />
                        <li aria-current="page" className="max-w-[40ch] truncate text-ink">{title}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-14">
                    {/* Cover and shelf controls follow you down the page on desktop */}
                    <div className="mx-auto w-full max-w-70 space-y-6 md:sticky md:top-24 md:col-span-4 md:max-w-none md:self-start">
                        <div className="shadow-cover-lg">
                            <BookCover src={cover} title={title} priority sizes="(min-width: 1024px) 340px, (min-width: 768px) 30vw, 280px" />
                        </div>
                        <LibraryControls bookId={_id} title={title} totalPages={pages} />
                    </div>

                    <div className="md:col-span-8">
                        <div className="flex flex-wrap gap-2">
                            {genres.map((g) => (
                                <Link
                                    key={g}
                                    href={`/explore?genre=${encodeURIComponent(g)}`}
                                    className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-ink transition-colors hover:border-ink/40"
                                >
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: genreColor(g).bg }} aria-hidden />
                                    {g}
                                </Link>
                            ))}
                        </div>

                        <h1 className="mt-5 text-5xl leading-[1.02] tracking-[-0.025em] text-ink md:text-6xl lg:text-[4.25rem]">{title}</h1>
                        <p className="mt-3 font-serif text-2xl italic text-ink-muted">
                            by{" "}
                            <Link
                                href={`/explore?q=${encodeURIComponent(author)}`}
                                className="text-ink decoration-ink/30 decoration-1 underline-offset-[5px] transition-colors hover:underline"
                            >
                                {author}
                            </Link>
                        </p>

                        <a href="#reviews" className="mt-5 inline-flex items-center gap-2.5 rounded-full text-sm text-ink-muted transition-colors hover:text-ink">
                            {ratingCount ? (
                                <>
                                    <StarRating value={ratingAvg} size={16} />
                                    <span className="font-semibold tabular-nums text-ink">{ratingAvg.toFixed(1)}</span>
                                    <span>
                                        {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <StarRating value={0} size={16} />
                                    <span>No ratings yet. Be the first to review it.</span>
                                </>
                            )}
                        </a>

                        {/* gap-px over a line-coloured background draws the rules between cells */}
                        <dl className="mt-10 grid grid-cols-2 gap-px border-y border-line bg-line sm:grid-cols-4">
                            {facts.map(({ label, value }) => (
                                <div key={label} className="bg-background py-4 pl-5 first:pl-0 nth-3:pl-0 sm:nth-3:pl-5">
                                    <dt className="eyebrow">{label}</dt>
                                    <dd className="mt-1.5 font-serif text-2xl text-ink">{value ?? "—"}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-10">
                            <h2 className="sr-only">About this book</h2>
                            <p className="max-w-[65ch] whitespace-pre-line text-[17px] leading-[1.75] text-ink/90 first-letter:float-left first-letter:mr-2.5 first-letter:mt-1.5 first-letter:font-serif first-letter:text-[4.25rem] first-letter:leading-[0.8] first-letter:text-ink">
                                {summary}
                            </p>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm text-ink-muted">
                            <p>
                                Added by <span className="font-semibold text-ink">{addedBy?.firstName || "a reader"}</span> on {formatDate(createdAt)}
                            </p>
                            {isOwner && (
                                <Button asChild size="sm" variant="outline">
                                    <Link href={`/edit-book/${_id}`}>
                                        <Pencil /> Edit details
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div id="reviews" className="scroll-mt-24 pt-24">
                    <Reviews bookId={_id} />
                </div>

                {similar.length > 0 && (
                    <section className="space-y-10 pt-24">
                        <SectionHeader
                            title="You might also like"
                            link={mainGenre ? { href: `/explore?genre=${encodeURIComponent(mainGenre)}`, label: `More ${mainGenre}` } : undefined}
                        />
                        <div className={BOOK_GRID}>
                            {similar.map((b) => (
                                <BookCard key={b._id} {...b} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </article>
    );
};

export default BookDetails;
