import type { Metadata } from "next";
import LibraryView from "../../../components/library/LibraryView";
import SectionHeader from "../../../components/SectionHeader";

export const metadata: Metadata = {
    title: "My Library",
};

export default function LibraryPage() {
    return (
        <section className="mx-auto max-w-7xl space-y-10 px-5 pt-12 md:pt-16">
            <SectionHeader
                as="h1"
                title="My Library"
                subtitle="What you're reading now, what's next, and what you've finished."
            />
            <LibraryView />
        </section>
    );
}
