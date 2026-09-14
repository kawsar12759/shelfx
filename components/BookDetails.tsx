import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, Globe, Pencil, Star, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import BookCard from "./BookCard";
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
    const genres = Array.isArray(genre) ? genre : [genre];

    const facts = [
        { icon: BookOpen, label: "Pages", value: pages },
        { icon: Calendar, label: "Published", value: publishedYear },
        { icon: Globe, label: "Language", value: language },
        { icon: Users, label: "On shelves", value: readersCount },
    ];

    return (
        <section className="min-h-screen bg-linear-to-b from-paper via-[#F4EFE9] to-[#EFE7DE]">
            <div className="mx-auto max-w-6xl space-y-20 px-5 py-10 md:py-14">
                <div className="space-y-6">
                    <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink">
                        <ArrowLeft className="h-4 w-4" /> Back to explore
                    </Link>

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
                        <div className="mx-auto w-full max-w-xs space-y-5 md:col-span-4 md:max-w-none">
                            <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg shadow-[0_20px_40px_-12px_rgba(74,52,40,0.45)]">
                                <Image src={cover} alt={`Cover of ${title}`} fill priority sizes="(min-width: 768px) 360px, 80vw" className="object-cover" />
                            </div>
                            <LibraryControls bookId={_id} totalPages={pages} />
                        </div>
    
                        <div className="space-y-7 md:col-span-8">
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {genres.map((g) => (
                                        <Link
                                            key={g}
                                            href={`/explore?genre=${encodeURIComponent(g)}`}
                                            className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-ink transition-colors hover:bg-[#DCC9B5]"
                                        >
                                            {g}
                                        </Link>
                                    ))}
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-ink md:text-5xl">{title}</h1>
                                <p className="flex items-center gap-2 text-lg text-ink-muted">
                                    <User className="h-4 w-4" />
                                    by{" "}
                                    <Link href={`/explore?q=${encodeURIComponent(author)}`} className="font-medium text-ink underline-offset-4 hover:underline">
                                        {author}
                                    </Link>
                                </p>
                                <a href="#reviews" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
                                    <Star className={`h-4 w-4 ${ratingCount ? "fill-gold text-gold" : ""}`} />
                                    {ratingCount ? (
                                        <>
                                            <span className="font-semibold text-ink">{ratingAvg.toFixed(1)}</span> · {ratingCount}{" "}
                                            {ratingCount === 1 ? "rating" : "ratings"}
                                        </>
                                    ) : (
                                        "No ratings yet — be the first"
                                    )}
                                </a>
                            </div>
    
                            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {facts.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="rounded-xl border border-line/80 bg-white/60 px-4 py-3">
                                        <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
                                            <Icon className="h-3.5 w-3.5" /> {label}
                                        </dt>
                                        <dd className="mt-1 font-serif text-lg font-bold text-ink">{value}</dd>
                                    </div>
                                ))}
                            </dl>
    
                            <div className="space-y-3">
                                <h2 className="text-xl font-bold text-ink">About this book</h2>
                                <p className="whitespace-pre-line text-base leading-relaxed text-[#5E4B3F]">{summary}</p>
                            </div>
    
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-5 text-sm text-ink-muted">
                                <p>
                                    Added by <span className="font-semibold text-ink">{addedBy?.firstName}</span> on {formatDate(createdAt)}
                                </p>
                                {isOwner && (
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/edit-book/${_id}`}>
                                            <Pencil className="h-4 w-4" /> Edit book
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div id="reviews" className="scroll-mt-24">
                    <Reviews bookId={_id} />
                </div>

                {similar.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-end justify-between gap-4">
                            <h2 className="text-3xl font-bold text-ink">You might also like</h2>
                            <Link href={`/explore?genre=${encodeURIComponent(genres[0])}`} className="text-sm font-medium text-ink-muted hover:text-ink">
                                More {genres[0]} →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                            {similar.map((b) => (
                                <BookCard key={b._id} {...b} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </section>
    );
};

export default BookDetails;
