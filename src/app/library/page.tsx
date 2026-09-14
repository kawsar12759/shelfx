import type { Metadata } from "next";
import LibraryView from "../../../components/library/LibraryView";

export const metadata: Metadata = {
    title: "My Library",
};

export default function LibraryPage() {
    return (
        <section className="min-h-screen bg-linear-to-b from-paper via-[#F4EFE9] to-[#EFE7DE]">
            <div className="mx-auto max-w-7xl space-y-10 px-5 py-14">
                <header className="max-w-3xl space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-ink md:text-5xl">My Library</h1>
                    <p className="text-lg leading-relaxed text-ink-muted">
                        Everything on your shelf — what you&apos;re reading now, what&apos;s next, and what you&apos;ve finished.
                    </p>
                </header>
                <LibraryView />
            </div>
        </section>
    );
}
