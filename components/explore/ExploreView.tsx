"use client";
import { Button } from "@/components/ui/button";
import { GENRES, SORT_OPTIONS, genreColor } from "@/lib/genres";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BookCard from "../BookCard";
import { BOOK_GRID, BookGridSkeleton } from "../BookCardSkeleton";

const PAGE_SIZE = 12;
const DEFAULTS: Record<string, string> = { genre: "All", sort: "newest", page: "1" };

type Results = { books: Book[]; total: number; totalPages: number; page: number };

/** Page numbers with ellipses, e.g. [1, "…", 4, 5, 6, "…", 10]. */
function pageList(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["…" as const, p] : [p]));
}

const ExploreView = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const topRef = useRef<HTMLDivElement>(null);

    const genre = (searchParams.get("genre") ?? "All").replace(/^"(.*)"$/, "$1");
    const sort = searchParams.get("sort") ?? "newest";
    const q = searchParams.get("q") ?? "";
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    const [query, setQuery] = useState(q);
    const [prevQ, setPrevQ] = useState(q);
    const [results, setResults] = useState<Results | null>(null);
    const [loading, setLoading] = useState(true);

    // Keep the input in sync when the URL changes from outside (e.g. an author link)
    if (q !== prevQ) {
        setPrevQ(q);
        setQuery(q);
    }

    const setParams = useCallback(
        (updates: Record<string, string | null>, { replace = false } = {}) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                if (!value || DEFAULTS[key] === value) params.delete(key);
                else params.set(key, value);
            });
            // Any filter change sends you back to the first page
            if (!("page" in updates)) params.delete("page");
            const qs = params.toString();
            const url = qs ? `${pathname}?${qs}` : pathname;
            if (replace) router.replace(url, { scroll: false });
            else router.push(url, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    // Debounce typing into the URL
    useEffect(() => {
        if (query.trim() === q) return;
        const t = setTimeout(() => setParams({ q: query.trim() || null }, { replace: true }), 350);
        return () => clearTimeout(t);
    }, [query, q, setParams]);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/books", {
                    params: { q: q || undefined, genre: genre !== "All" ? genre : undefined, sort, page, limit: PAGE_SIZE },
                });
                if (!cancelled) setResults(res.data);
            } catch {
                if (!cancelled) setResults({ books: [], total: 0, totalPages: 1, page: 1 });
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, [q, genre, sort, page]);

    const goToPage = (p: number) => {
        setParams({ page: String(p) });
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const hasFilters = Boolean(q) || genre !== "All" || sort !== "newest";
    const from = results && results.total ? (results.page - 1) * PAGE_SIZE + 1 : 0;
    const to = results ? Math.min(results.page * PAGE_SIZE, results.total) : 0;
    const firstLoad = loading && !results;

    return (
        <div ref={topRef} className="scroll-mt-16">
            {/* Toolbar stays in reach while scrolling the results */}
            <div className="sticky top-16 z-30 -mx-5 space-y-3 border-b border-line bg-background/90 px-5 pb-3 pt-4 backdrop-blur-md backdrop-saturate-150">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-ink-muted" />
                        <input
                            type="search"
                            data-search-input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                            placeholder="Search by title or author"
                            aria-label="Search books"
                            className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-11 text-base text-ink shadow-soft transition-[border-color,box-shadow] placeholder:text-ink-faint hover:border-ink/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 [&::-webkit-search-cancel-button]:hidden"
                        />
                        {query && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => setQuery("")}
                                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/6 hover:text-ink"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <label className="sr-only" htmlFor="sort">Sort books</label>
                    <select
                        id="sort"
                        value={sort}
                        onChange={(e) => setParams({ sort: e.target.value })}
                        className="select-chevron h-12 w-36 shrink-0 cursor-pointer rounded-full border border-line bg-white pl-4 text-sm font-medium text-ink shadow-soft transition-colors hover:border-ink/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 sm:w-44 sm:pl-5"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                {/* Genres scroll sideways; the mask fades the clipped edge */}
                <div
                    className="scrollbar-none -mx-5 flex gap-1.5 overflow-x-auto px-5 mask-[linear-gradient(to_right,transparent,black_20px,black_calc(100%-40px),transparent)]"
                    role="group"
                    aria-label="Filter by genre"
                >
                    {["All", ...GENRES].map((g) => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => setParams({ genre: g })}
                            aria-pressed={genre === g}
                            className={cn(
                                "flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                                genre === g
                                    ? "border-ink bg-ink text-white"
                                    : "border-line bg-card text-ink-muted hover:border-ink/30 hover:text-ink"
                            )}
                        >
                            {g !== "All" && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: genreColor(g).bg }} aria-hidden />}
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 py-6 text-sm text-ink-muted">
                <p aria-live="polite">
                    {firstLoad || !results
                        ? "Searching the shelves…"
                        : results.total === 0
                            ? "No books found"
                            : <>Showing <span className="tabular-nums text-ink">{from}–{to}</span> of <span className="tabular-nums text-ink">{results.total}</span> {results.total === 1 ? "book" : "books"}</>}
                    {q && results && results.total > 0 && <> for “<span className="font-semibold text-ink">{q}</span>”</>}
                </p>
                {hasFilters && (
                    <button
                        type="button"
                        onClick={() => router.push(pathname, { scroll: false })}
                        className="flex cursor-pointer items-center gap-1 rounded-full font-medium text-ink transition-colors hover:text-ink-muted"
                    >
                        <X className="h-3.5 w-3.5" /> Clear filters
                    </button>
                )}
            </div>

            {firstLoad ? (
                <BookGridSkeleton count={8} />
            ) : results && results.books.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-line bg-card px-6 py-20 text-center">
                    <p className="font-serif text-4xl text-ink">Nothing on this shelf</p>
                    <p className="mt-3 max-w-md text-ink-muted">
                        {q
                            ? <>No title or author matches “{q}”{genre !== "All" ? ` in ${genre}` : ""}. Check the spelling, or try fewer words.</>
                            : `There are no ${genre} books yet.`}
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {hasFilters && (
                            <Button variant="outline" onClick={() => router.push(pathname, { scroll: false })}>
                                Clear filters
                            </Button>
                        )}
                        <Button asChild>
                            <Link href="/add-book">Add the book yourself</Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className={cn(BOOK_GRID, "transition-opacity duration-300", loading && "pointer-events-none opacity-50")}
                    aria-busy={loading}
                >
                    {results?.books.map((book) => (
                        <BookCard key={book._id} {...book} />
                    ))}
                </div>
            )}

            {results && results.totalPages > 1 && (
                <nav className="mt-16 flex items-center justify-center gap-1" aria-label="Pagination">
                    <Button variant="ghost" size="sm" disabled={page <= 1 || loading} onClick={() => goToPage(page - 1)} className="h-10 px-3">
                        <ArrowLeft /> <span className="hidden sm:inline">Previous</span>
                    </Button>
                    {pageList(page, results.totalPages).map((p, i) =>
                        p === "…" ? (
                            <span key={`gap-${i}`} className="w-8 text-center text-ink-faint">…</span>
                        ) : (
                            <Button
                                key={p}
                                size="icon"
                                variant={p === page ? "default" : "ghost"}
                                onClick={() => p !== page && goToPage(p)}
                                aria-current={p === page ? "page" : undefined}
                                aria-label={`Page ${p}`}
                                className="tabular-nums"
                            >
                                {p}
                            </Button>
                        )
                    )}
                    <Button variant="ghost" size="sm" disabled={page >= results.totalPages || loading} onClick={() => goToPage(page + 1)} className="h-10 px-3">
                        <span className="hidden sm:inline">Next</span> <ArrowRight />
                    </Button>
                </nav>
            )}
        </div>
    );
};

export default ExploreView;
