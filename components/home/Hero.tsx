import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Library } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroProps = {
    stats: { books: number; readers: number; reviews: number };
    covers: Pick<Book, "_id" | "cover" | "title">[];
};

// Position/rotation for the fanned stack of covers on the right
const FAN = [
    "left-0 top-10 -rotate-12 z-10",
    "left-1/2 top-0 -translate-x-1/2 rotate-0 z-20",
    "right-0 top-10 rotate-12 z-10",
];

const Hero = ({ stats, covers }: HeroProps) => {
    const statItems = [
        { label: "Books", value: stats.books },
        { label: "Readers", value: stats.readers },
        { label: "Reviews", value: stats.reviews },
    ];

    return (
        <section className="relative overflow-hidden border-b border-line">
            <div className="absolute inset-0 bg-linear-to-br from-paper via-[#F4EFE9] to-[#EFE7DE]" />
            <div className="paper-dots absolute inset-0 opacity-[0.12]" />
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sand/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#EADFD3]/40 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:py-28">
                <div className="space-y-7 text-center lg:text-left">
                    

                    <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                        Every book you love,{" "}
                        <span className="relative inline-block">
                            <span className="relative z-10 italic text-ink">on one shelf.</span>
                            <span className="absolute -bottom-1 left-0 right-0 h-4 rounded-full bg-sand/80 blur-[1px]" />
                        </span>
                    </h1>

                    <p className="mx-auto max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl lg:mx-0">
                        Discover timeless stories and modern ideas, track what you&apos;re reading, and share
                        honest reviews with readers from around the world.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                        <Button asChild size="lg" className="group gap-2 rounded-full px-8 text-base shadow-md transition-all hover:shadow-lg">
                            <Link href="/explore">
                                Explore books
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="rounded-full border-ink/30 bg-white/60 px-8 text-base text-ink">
                            <Link href="/library">
                                <Library className="h-5 w-5" /> My library
                            </Link>
                        </Button>
                    </div>

                    <div className="mx-auto flex max-w-md justify-center divide-x divide-line pt-2 lg:mx-0 lg:justify-start">
                        {statItems.map(({ label, value }) => (
                            <div key={label} className="px-6 first:pl-0 last:pr-0">
                                <p className="font-serif text-3xl font-bold text-ink">{value.toLocaleString("en-US")}</p>
                                <p className="text-sm text-ink-muted">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {covers.length >= 3 && (
                    <div className="relative mx-auto hidden h-104 w-full max-w-md sm:block" aria-hidden>
                        {covers.slice(0, 3).map((book, i) => (
                            <Link
                                key={book._id}
                                href={`/book/${book._id}`}
                                tabIndex={-1}
                                className={`absolute w-48 transition-transform duration-500 hover:z-30 hover:-translate-y-3 ${FAN[i]}`}
                            >
                                <div className="relative aspect-2/3 overflow-hidden rounded-lg shadow-[0_25px_50px_-12px_rgba(74,52,40,0.5)] ring-1 ring-black/5">
                                    <Image src={book.cover} alt="" fill sizes="192px" priority className="object-cover" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;
