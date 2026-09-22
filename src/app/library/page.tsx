import type { Metadata } from "next";
import LibraryView from "../../../components/library/LibraryView";

export const metadata: Metadata = {
    title: "My Library",
};

export default function LibraryPage() {
    return (
        <section className="min-h-screen">
            <div className="mx-auto max-w-7xl space-y-10 px-5 py-14">
                <header className="space-y-3 border-b border-line pb-8">
                    <h1 className="text-5xl leading-none text-ink md:text-6xl">My Library</h1>
                    <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">
                        Everything on your shelf — what you&apos;re reading now, what&apos;s next, and what you&apos;ve finished.
                    </p>
                </header>
                <LibraryView />
            </div>
        </section>
    );
}
