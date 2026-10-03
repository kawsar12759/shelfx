import Link from "next/link";
import { Search } from "lucide-react";
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
    // On narrow screens the first spines sit near the page edge, so their title card opens rightwards
    const cardAlign = index < 2 ? "left-0" : "left-1/2 -translate-x-1/2";
    const { bg, fg } = genreColor(genre?.[0]);
    // Width is a share of the shelf proportional to page count; height varies like real books
    const height = 70 + Math.round(seed(_id) * 30);
    // Fewer spines on narrow screens so each stays wide enough to read
    const visibility = index >= 14 ? "hidden lg:flex" : index >= 8 ? "hidden sm:flex" : "flex";

    return (
        <li className={`${visibility} group/spine relative h-full min-w-0 items-end`} style={{ flex: `${naturalWidth(pages)} 1 0px` }}>
            <Link
                href={`/book/${_id}`}
                aria-label={`${title} by ${author}`}
                style={{ height: `${height}%`, backgroundColor: bg, color: fg }}
                className="relative flex w-full flex-col items-center overflow-hidden rounded-t-[3px] px-1 py-3 outline-offset-2 transition-transform duration-300 ease-out-soft hover:-translate-y-3 focus-visible:-translate-y-3 focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none"
            >
                {/* Rounded-spine shading */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.22), rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.04) 55%, rgba(0,0,0,0.25))" }}
                />
                {/* Head and tail bands */}
                <span aria-hidden className="absolute inset-x-0 top-2 h-[3px] border-y border-current opacity-35" />
                <span aria-hidden className="absolute inset-x-0 bottom-2 h-[3px] border-y border-current opacity-35" />
                <span className="spine-text relative mt-2 max-h-[calc(100%-1.75rem)] overflow-hidden text-ellipsis whitespace-nowrap font-condensed text-[13px] font-bold uppercase tracking-[0.06em]">
                    {title}
                </span>
            </Link>
            {/* Title card that rises with the book */}
            <span
                role="presentation"
                className={`pointer-events-none absolute bottom-full ${cardAlign} z-10 mb-1 hidden w-max max-w-52 translate-y-1 rounded-lg bg-ink px-3 py-2 text-left opacity-0 shadow-lift transition-[opacity,transform] duration-200 group-hover/spine:-translate-y-3 group-hover/spine:opacity-100 group-focus-within/spine:-translate-y-3 group-focus-within/spine:opacity-100 md:block motion-reduce:transition-none`}
            >
                <span className="block font-serif text-[15px] leading-snug text-white">{title}</span>
                <span className="block text-xs text-white/60">{author}</span>
            </span>
        </li>
    );
};

/** L-shaped metal bookend, mirrored for the left side. */
const Bookend = ({ side }: { side: "left" | "right" }) => (
    <div className={`flex h-[55%] w-10 shrink-0 items-end sm:w-14 ${side === "left" ? "mr-1.5 flex-row-reverse" : "ml-1.5"}`} aria-hidden>
        <span className="h-full w-2.5 rounded-t-[2px] bg-ink" />
        <span className="h-2.5 flex-1 bg-ink" />
    </div>
);

const Hero = ({ stats, books }: HeroProps) => {
    const statLine = [
        { label: stats.books === 1 ? "book" : "books", value: stats.books },
        { label: stats.readers === 1 ? "reader" : "readers", value: stats.readers },
        { label: stats.reviews === 1 ? "review" : "reviews", value: stats.reviews },
    ];

    // Spines grow to fill the shelf, but never past 1.5x their natural width
    const maxShelfWidth = books.reduce((sum, b) => sum + naturalWidth(b.pages) * 1.5 + 3, 0);

    return (
        <section className="relative overflow-x-clip">
            <div className="mx-auto max-w-7xl px-5 pt-12 text-center md:pt-14">
                <h1 className="mx-auto text-[3.25rem] leading-[0.98] tracking-[-0.03em] text-ink sm:text-7xl lg:text-[4.75rem]">
                    {/* One sentence per line on desktop; narrower screens balance the wrap */}
                    <span className="block lg:whitespace-nowrap">Track what you read.</span>
                    <span className="block italic text-ink-muted lg:whitespace-nowrap">Find what to read next.</span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
                    A shelf you keep with other readers. Find a book, log the page you&apos;re on,
                    and say what you thought when you finish.
                </p>

                {/* Plain GET form: works before hydration and lands on a shareable URL */}
                <form action="/explore" role="search" className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-5 text-left shadow-soft transition-shadow focus-within:border-ink/30 focus-within:shadow-lift">
                    <Search className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden />
                    <input
                        type="search"
                        name="q"
                        aria-label="Search books by title or author"
                        placeholder="Search by title or author"
                        className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                    />
                    <Button type="submit" className="h-11 px-6">Search</Button>
                </form>
                <p className="mt-4 font-mono text-xs text-ink-muted">
                    {statLine.map(({ label, value }, i) => (
                        <span key={label}>
                            {i > 0 && <span className="mx-2 text-line" aria-hidden>/</span>}
                            <span className="font-medium tabular-nums text-ink">{value.toLocaleString("en-US")}</span> {label}
                        </span>
                    ))}
                </p>

                {books.length > 0 && (
                    <div className="mt-12 text-left">
                        {/* The books sit centred between two bookends; the plank runs the full width */}
                        <div className="flex h-52 items-end justify-center md:h-[clamp(12rem,30svh,18rem)]">
                            <Bookend side="left" />
                            <ul className="flex h-full min-w-0 flex-1 items-end gap-0.75" style={{ maxWidth: maxShelfWidth }}>
                                {books.map((book, i) => (
                                    <Spine key={book._id} {...book} index={i} />
                                ))}
                            </ul>
                            <Bookend side="right" />
                        </div>
                        {/* Shelf plank: lit top edge, then the board, then its shadow on the wall */}
                        <div aria-hidden>
                            <div className="h-px bg-white/20" />
                            <div className="h-3 rounded-b-[2px] bg-linear-to-b from-ink to-ink-strong" />
                            <div className="h-6 bg-linear-to-b from-ink/15 to-transparent" />
                        </div>
                        <p className="-mt-3 pb-4 text-center font-mono text-[11px] text-ink-muted">
                            Newest on the shelf. Spine colour is genre, width is page count.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;
