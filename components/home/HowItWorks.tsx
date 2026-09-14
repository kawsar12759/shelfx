import { Button } from "@/components/ui/button";
import { BookmarkPlus, Compass, LineChart, MessageSquareText } from "lucide-react";
import Link from "next/link";

const STEPS = [
    { icon: Compass, title: "Discover", text: "Search the collection and filter by genre, rating or popularity." },
    { icon: BookmarkPlus, title: "Shelve it", text: "Save books to Want to Read, Currently Reading or Finished." },
    { icon: LineChart, title: "Track progress", text: "Log the page you're on and watch your reading stats grow." },
    { icon: MessageSquareText, title: "Review", text: "Rate what you've read and help other readers pick their next book." },
];

const HowItWorks = () => {
    return (
        <section className="px-5 py-20">
            <div className="mx-auto max-w-7xl space-y-12">
                <div className="mx-auto max-w-2xl space-y-3 text-center">
                    <h2 className="text-4xl font-extrabold text-ink">How ShelfX works</h2>
                    <p className="text-ink-muted">From &ldquo;I should read that&rdquo; to &ldquo;I finished it&rdquo; in four simple steps.</p>
                </div>
                <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map(({ icon: Icon, title, text }, i) => (
                        <li key={title} className="relative rounded-2xl border border-line/80 bg-white/70 p-6">
                            <span className="absolute right-5 top-4 font-serif text-5xl font-bold text-sand">{i + 1}</span>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white">
                                <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 text-xl font-bold text-ink">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
                        </li>
                    ))}
                </ol>

                <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-ink px-8 py-10 text-center text-white md:flex-row md:text-left">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold">Know a book everyone should read?</h3>
                        <p className="text-white/75">Add it to ShelfX and share it with the community.</p>
                    </div>
                    <Button asChild size="lg" className="shrink-0 rounded-full bg-white px-8 text-ink hover:bg-sand">
                        <Link href="/add-book"><BookmarkPlus className="h-5 w-5" /> Add a book</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
