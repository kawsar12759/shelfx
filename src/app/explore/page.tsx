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
        <section className="min-h-screen bg-linear-to-b from-paper via-[#F4EFE9] to-[#EFE7DE]">
            <div className="mx-auto max-w-7xl space-y-10 px-5 py-14">
                <header className="max-w-3xl space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
                        Explore the Library
                    </h1>
                    <p className="text-lg leading-relaxed text-ink-muted">
                        Books from every genre, era and style — search by title or author, filter by genre,
                        and sort by what readers love most.
                    </p>
                </header>
                <Suspense fallback={<BookGridSkeleton count={8} />}>
                    <ExploreView />
                </Suspense>
            </div>
        </section>
    );
}
