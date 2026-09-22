import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { genreColor } from "@/lib/genres";

// Book size in px. The covers are real 3D boxes, so these stay fixed rather than fluid.
const W = 132;
const H = 198;
const DEPTH = 24;
// Each shelf row: headroom for the hover lift, the book, then the plank it stands on
const PLANK = 10;
const ROW = 32 + H + PLANK;

/** The ShelfX three-spine mark, drawn in the genre colour inside the publisher oval. */
const Mark = ({ color }: { color: string }) => (
    <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden>
        <rect x="3" y="5" width="4" height="16" fill={color} />
        <rect x="8.5" y="3" width="4" height="18" fill={color} />
        <rect x="15" y="6" width="4" height="15.5" fill={color} transform="rotate(-14 17 21)" />
    </svg>
);

/** A Penguin-style paperback turned slightly to show its pages; it faces you on hover. */
const GenreBook = ({ name, count }: { name: string; count: number }) => {
    const { bg, fg } = genreColor(name);

    return (
        <li className="flex items-end justify-center" style={{ height: ROW, paddingBottom: PLANK, perspective: 900 }}>
            <Link
                href={`/explore?genre=${encodeURIComponent(name)}`}
                aria-label={`${name}, ${count} ${count === 1 ? "book" : "books"}`}
                style={{ width: W, height: H }}
                className="relative block outline-offset-8 transition-transform duration-500 ease-out transform-3d transform-[rotateY(-32deg)] hover:transform-[rotateY(-6deg)_translateY(-6px)] focus-visible:outline-2 focus-visible:outline-ring focus-visible:transform-[rotateY(-6deg)_translateY(-6px)] motion-reduce:transition-none"
            >
                {/* Back cover, casting the shadow */}
                <span
                    className="absolute rounded-r-[3px]"
                    style={{ top: 1, bottom: 1, left: 0, width: W - 4, backgroundColor: bg, transform: `translateZ(${-DEPTH / 2}px)`, boxShadow: "-12px 8px 28px -6px rgba(20,27,52,0.45)" }}
                    aria-hidden
                />
                {/* Page block on the fore-edge */}
                <span
                    className="absolute"
                    style={{
                        top: 3,
                        height: H - 6,
                        width: DEPTH,
                        transform: `translateX(${W - DEPTH / 2 - 3}px) rotateY(90deg)`,
                        background:
                            "linear-gradient(90deg, rgba(0,0,0,0.12), transparent 20%, transparent 80%, rgba(0,0,0,0.18)), repeating-linear-gradient(90deg, #FBFAF6 0px, #FBFAF6 2px, #D6D4CB 2px, #D6D4CB 3px)",
                    }}
                    aria-hidden
                />
                {/* Front cover */}
                <span
                    className="absolute inset-0 flex flex-col overflow-hidden rounded-r-[3px] rounded-l-[1px]"
                    style={{ backgroundColor: bg, color: fg, transform: `translateZ(${DEPTH / 2}px)` }}
                >
                    <span className="flex flex-1 items-center justify-center font-mono text-[9px] uppercase tracking-[0.25em] opacity-80">
                        ShelfX Books
                    </span>
                    <span className="flex flex-col items-center justify-center gap-1 border-y border-black/15 bg-[#FBFAF6] px-3 py-4 text-center">
                        <span className="font-condensed text-xl font-extrabold leading-none text-ink">{name}</span>
                        <span className="font-mono text-[10px] text-ink-muted">
                            {count} {count === 1 ? "book" : "books"}
                        </span>
                    </span>
                    <span className="flex flex-1 items-center justify-center">
                        <span className="flex h-5 w-8 items-center justify-center rounded-[50%] bg-[#FBFAF6]">
                            <Mark color={bg} />
                        </span>
                    </span>
                    {/* Spine hinge and a little light across the cover */}
                    <span
                        className="pointer-events-none absolute inset-y-0 left-0 w-3"
                        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.28), rgba(255,255,255,0.14) 55%, rgba(0,0,0,0.1))" }}
                        aria-hidden
                    />
                    <span
                        className="pointer-events-none absolute inset-0"
                        style={{ background: "linear-gradient(105deg, rgba(255,255,255,0.12), transparent 45%, rgba(0,0,0,0.1))" }}
                        aria-hidden
                    />
                </span>
            </Link>
        </li>
    );
};

const GenreGrid = ({ genres }: { genres: { name: string; count: number }[] }) => {
    if (genres.length === 0) return null;

    return (
        <section className="border-y border-line bg-stack/60 px-5 py-16">
            <div className="mx-auto max-w-7xl space-y-10">
                <div className="flex flex-col items-start justify-between gap-4 border-b border-line pb-5 md:flex-row md:items-end">
                    <div className="space-y-2">
                        <h2 className="text-4xl text-ink md:text-5xl">Browse by genre</h2>
                        <p className="text-ink-muted">The genres with the most books right now.</p>
                    </div>
                    <Link
                        href="/explore"
                        className="group inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                        All genres <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </Link>
                </div>

                {/* Books wrap onto as many shelves as the width needs; the background draws a plank under each row */}
                <ul
                    className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"
                    style={{
                        backgroundImage: `linear-gradient(to top, #141B34 ${PLANK}px, transparent ${PLANK}px)`,
                        backgroundSize: `100% ${ROW}px`,
                    }}
                >
                    {genres.slice(0, 8).map((g) => (
                        <GenreBook key={g.name} {...g} />
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default GenreGrid;
