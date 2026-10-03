import { Button } from "@/components/ui/button";
import { BookmarkPlus, Compass, LineChart, MessageSquareText, Plus } from "lucide-react";
import Link from "next/link";
import SectionHeader from "../SectionHeader";

const STEPS = [
    { icon: Compass, title: "Discover", text: "Search the collection and filter by genre, rating or how many readers have shelved it." },
    { icon: BookmarkPlus, title: "Shelve it", text: "Save a book to Want to Read, Currently Reading or Finished." },
    { icon: LineChart, title: "Track progress", text: "Log the page you're on and watch your year in reading add up." },
    { icon: MessageSquareText, title: "Review", text: "Rate what you've read and help the next reader decide." },
];

/** First-visit explainer, then an invitation to contribute. Signed-in readers only see the invitation. */
const HowItWorks = ({ signedIn }: { signedIn: boolean }) => {
    return (
        <section className="px-5 pt-28">
            <div className="mx-auto max-w-7xl space-y-16">
                {!signedIn && (
                    <div className="space-y-10">
                        <SectionHeader title="How ShelfX works" />
                        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                            {STEPS.map(({ icon: Icon, title, text }) => (
                                <li key={title} className="bg-card p-7">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink">
                                        <Icon className="size-4.5" strokeWidth={1.75} />
                                    </span>
                                    <h3 className="mt-6 text-2xl text-ink">{title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-12 text-white md:px-14 md:py-16">
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                        <div className="max-w-xl space-y-3">
                            <h2 className="text-4xl leading-[1.05] md:text-5xl">
                                Know a book that isn&apos;t <span className="italic text-white/60">here yet?</span>
                            </h2>
                            <p className="text-white/65">Add it with a cover and summary, and every reader on ShelfX can shelve it.</p>
                        </div>
                        <Button asChild size="lg" className="shrink-0 bg-white text-ink hover:bg-paper">
                            <Link href="/add-book"><Plus /> Add a book</Link>
                        </Button>
                    </div>
                    {/* A faint row of spines leaning into the corner */}
                    <div aria-hidden className="pointer-events-none absolute -bottom-2 right-10 hidden h-40 items-end gap-1 opacity-[0.09] lg:flex">
                        {[72, 96, 84, 100, 64, 88].map((h, i) => (
                            <span key={i} className="w-7 rounded-t-[3px] bg-white" style={{ height: `${h}%` }} />
                        ))}
                        <span className="ml-1 h-[86%] w-7 origin-bottom-left rotate-12 rounded-t-[3px] bg-white" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
