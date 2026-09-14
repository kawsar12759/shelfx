"use client";
import { Button } from "@/components/ui/button";
import { GENRES, SORT_OPTIONS } from "@/lib/genres";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ChevronLeft, ChevronRight, Search, SearchX, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import BookCard from "../BookCard";
import { BookGridSkeleton } from "../BookCardSkeleton";

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
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const hasFilters = q || genre !== "All" || sort !== "newest";
    const from = results && results.total ? (results.page - 1) * PAGE_SIZE + 1 : 0;
    const to = results ? Math.min(results.page * PAGE_SIZE, results.total) : 0;

    return (
        <div className="space-y-10">
            {/* Search + sort */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by title or author…"
                        aria-label="Search books"
                        className="h-12 w-full rounded-full border border-line bg-white/80 pl-12 pr-10 text-base text-ink shadow-sm placeholder:text-ink-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
                    />
                    {query && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-ink-muted hover:bg-sand/60 hover:text-ink"
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
                    className="h-12 cursor-pointer rounded-full border border-line bg-white/80 px-5 text-sm font-medium text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* Genres */}
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {["All", ...GENRES].map((g) => (
                    <button
                        key={g}
                        type="button"
                        onClick={() => setParams({ genre: g })}
                        aria-pressed={genre === g}
                        className={cn(
                            "shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                            genre === g
                                ? "border-ink bg-ink text-white"
                                : "border-line bg-white/60 text-ink hover:bg-sand/50"
                        )}
                    >
                        {g}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
                <p aria-live="polite">
                    {loading || !results
                        ? "Searching the shelves…"
                        : results.total === 0
                            ? "No books found"
                            : `Showing ${from}–${to} of ${results.total} ${results.total === 1 ? "book" : "books"}`}
                    {q && !loading && <> for “<span className="font-semibold text-ink">{q}</span>”</>}
                </p>
                {hasFilters && (
                    <button type="button" onClick={() => router.push(pathname, { scroll: false })} className="cursor-pointer font-medium text-ink underline-offset-4 hover:underline">
                        Clear all filters
                    </button>
                )}
            </div>

            {loading || !results ? (
                <BookGridSkeleton count={8} />
            ) : results.books.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white/50 py-20 text-center">
                    <SearchX className="h-10 w-10 text-[#C9B9A7]" />
                    <p className="text-lg font-semibold text-ink">Nothing on this shelf yet</p>
                    <p className="max-w-sm text-sm text-ink-muted">Try a different search term or genre — or add the book yourself.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
                    {results.books.map((book) => (
                        <BookCard key={book._id} {...book} />
                    ))}
                </div>
            )}

            {results && results.totalPages > 1 && !loading && (
                <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
                    <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)} className="cursor-pointer">
                        <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    {pageList(page, results.totalPages).map((p, i) =>
                        p === "…" ? (
                            <span key={`gap-${i}`} className="px-2 text-ink-muted">…</span>
                        ) : (
                            <Button
                                key={p}
                                size="icon-sm"
                                variant={p === page ? "default" : "ghost"}
                                onClick={() => goToPage(p)}
                                aria-current={p === page ? "page" : undefined}
                                className="cursor-pointer"
                            >
                                {p}
                            </Button>
                        )
                    )}
                    <Button variant="ghost" size="sm" disabled={page >= results.totalPages} onClick={() => goToPage(page + 1)} className="cursor-pointer">
                        Next <ChevronRight className="h-4 w-4" />
                    </Button>
                </nav>
            )}
        </div>
    );
};

export default ExploreView;
