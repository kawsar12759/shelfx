import type { Metadata } from "next";
import { Suspense } from "react";
import ExploreView from "../../../components/explore/ExploreView";
import { BookGridSkeleton } from "../../../components/BookCardSkeleton";
import SectionHeader from "../../../components/SectionHeader";

export const metadata: Metadata = {
    title: "Explore",
    description: "Search and browse the ShelfX collection by genre, rating and popularity.",
};

export default function ExplorePage() {
    return (
        <section className="mx-auto max-w-7xl px-5 pt-12 md:pt-16">
            <SectionHeader
                as="h1"
                title="Explore"
                subtitle="Search by title or author, narrow by genre, and sort by rating or by how many readers have shelved a book."
                className="mb-6"
            />
            <Suspense fallback={<BookGridSkeleton count={8} />}>
                <ExploreView />
            </Suspense>
        </section>
    );
}
