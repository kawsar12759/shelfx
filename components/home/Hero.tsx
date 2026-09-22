import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { genreColor } from "@/lib/genres";

type HeroProps = {
    stats: { books: number; readers: number; reviews: number };
    books: Pick<Book, "_id" | "title" | "author" | "genre" | "pages">[];
};

/** Stable 0–1 value per book, so spine heights vary but don't jump between renders. */
function seed(id: string) {
    // Hash the whole id: ObjectIds created together share their trailing bytes
    let h = 0;
    for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return (h % 1000) / 1000;
}

function naturalWidth(pages?: number) {
    return Math.min(Math.max((pages || 250) / 9, 30), 62);
}

const Spine = ({ _id, title, author, genre, pages, index }: HeroProps["books"][number] & { index: number }) => {
    const { bg, fg } = genreColor(genre?.[0]);
    // Width is a share of the shelf proportional to page count; height varies like real books
    const height = 70 + Math.round(seed(_id) * 30);
    // Fewer spines on narrow screens so each stays wide enough to read
    const visibility = index >= 14 ? "hidden lg:flex" : index >= 8 ? "hidden sm:flex" : "flex";

    return (
        <li className={`${visibility} h-full min-w-0 items-end`} style={{ flex: `${naturalWidth(pages)} 1 0px` }}>
            <Link
                href={`/book/${_id}`}
                aria-label={`${title} by ${author}`}
                title={`${title} — ${author}`}
                style={{ height: `${height}%`, backgroundColor: bg, color: fg }}
                className="flex w-full flex-col items-center justify-between overflow-hidden rounded-t-[2px] px-1 pb-2 pt-3 outline-offset-2 transition-transform duration-200 hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none"
            >
                <span className="spine-text max-h-full overflow-hidden text-ellipsis whitespace-nowrap font-condensed text-[13px] font-bold uppercase tracking-wide">
                    {title}
                </span>
                <span className="mt-2 h-px w-3/5 shrink-0 bg-current opacity-50" aria-hidden />
            </Link>
        </li>
    );
};

const Hero = ({ stats, books }: HeroProps) => {
    const statItems = [
        { label: "Books", value: stats.books },
        { label: "Readers", value: stats.readers },
        { label: "Reviews", value: stats.reviews },
    ];

    // Spines grow to fill the shelf, but never past 1.5x their natural width
    const maxShelfWidth = books.reduce((sum, b) => sum + naturalWidth(b.pages) * 1.5 + 3, 0);

    return (
        <section className="border-b border-line">
            <div className="mx-auto max-w-7xl px-5 pt-14 md:pt-20">
                <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
                    <div className="space-y-6 lg:col-span-8">
                        <h1 className="text-5xl leading-[0.92] text-ink sm:text-6xl md:text-7xl lg:text-8xl">
                            Track what you read.
                            <span className="block text-ink-muted">Find what to read next.</span>
                        </h1>
                        <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
                            Search books added by other readers, put them on your shelf, log the page
                            you&apos;re on and leave a review when you finish.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg" className="group gap-2 px-6 text-base">
                                <Link href="/explore">
                                    Explore books
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="px-6 text-base">
                                <Link href="/library">My library</Link>
                            </Button>
                        </div>
                    </div>

                    <dl className="border-t border-ink font-mono text-sm lg:col-span-4">
                        {statItems.map(({ label, value }) => (
                            <div key={label} className="flex items-baseline justify-between border-b border-line py-2.5">
                                <dt className="uppercase tracking-wider text-ink-muted">{label}</dt>
                                <dd className="text-base font-medium tabular-nums text-ink">{value.toLocaleString("en-US")}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {books.length > 0 && (
                    <div className="mt-14 md:mt-16">
                        <div className="flex h-52 items-end md:h-64">
                            <ul className="flex h-full min-w-0 flex-1 items-end gap-[3px]" style={{ maxWidth: maxShelfWidth }}>
                                {books.map((book, i) => (
                                    <Spine key={book._id} {...book} index={i} />
                                ))}
                            </ul>
                            <div className="ml-1 flex h-[55%] w-10 shrink-0 items-end sm:w-14" aria-hidden>
                                <span className="h-full w-2.5 bg-ink" />
                                <span className="h-2.5 flex-1 bg-ink" />
                            </div>
                        </div>
                        <div className="h-2.5 bg-ink" aria-hidden />
                        <p className="py-3 font-mono text-xs text-ink-muted">
                            Newest on the shelf. Spine colour is genre, width is page count.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;
