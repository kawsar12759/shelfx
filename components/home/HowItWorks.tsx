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
                <h2 className="text-4xl text-ink md:text-5xl">How ShelfX works</h2>
                <ol className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map(({ icon: Icon, title, text }) => (
                        <li key={title} className="border-b border-line py-6 sm:pr-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                            <Icon className="h-5 w-5 text-ink" strokeWidth={1.75} />
                            <h3 className="mt-4 text-2xl text-ink">{title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{text}</p>
                        </li>
                    ))}
                </ol>

                <div className="flex flex-col items-start justify-between gap-6 rounded-sm bg-ink px-8 py-10 text-white md:flex-row md:items-center">
                    <div className="space-y-2">
                        <h3 className="text-3xl md:text-4xl">Know a book that isn&apos;t here yet?</h3>
                        <p className="text-white/70">Add it with a cover and summary, and anyone on ShelfX can shelve it.</p>
                    </div>
                    <Button asChild size="lg" className="shrink-0 bg-white px-6 text-ink hover:bg-stack">
                        <Link href="/add-book"><BookmarkPlus className="h-5 w-5" /> Add a book</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
