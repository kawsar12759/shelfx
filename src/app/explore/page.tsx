import type { Metadata } from "next";
import { Suspense } from "react";
import ExploreView from "../../../components/explore/ExploreView";
import { BookGridSkeleton } from "../../../components/BookCardSkeleton";

export const metadata: Metadata = {
    title: "Explore",
    description: "Search and browse the ShelfX collection by genre, rating and popularity.",
};

export default function ExplorePage() {
    return (
        <section className="min-h-screen">
            <div className="mx-auto max-w-7xl space-y-10 px-5 py-14">
                <header className="space-y-3 border-b border-line pb-8">
                    <h1 className="text-5xl leading-none text-ink md:text-6xl">
                        Explore
                    </h1>
                    <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">
                        Search by title or author, narrow by genre, and sort by rating or by how many
                        readers have shelved a book.
                    </p>
                </header>
                <Suspense fallback={<BookGridSkeleton count={8} />}>
                    <ExploreView />
                </Suspense>
            </div>
        </section>
    );
}
