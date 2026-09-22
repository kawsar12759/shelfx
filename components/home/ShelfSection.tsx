import { ArrowRight } from "lucide-react";
import Link from "next/link";
import BookCard from "../BookCard";

type ShelfSectionProps = {
    title: string;
    subtitle?: string;
    href: string;
    books: Book[];
};

const ShelfSection = ({ title, subtitle, href, books }: ShelfSectionProps) => {
    if (books.length === 0) return null;

    return (
        <section className="px-5 py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex border-b border-line pb-5 flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div className="space-y-2">
                        <h2 className="text-4xl text-ink md:text-5xl">{title}</h2>
                        {subtitle && <p className="text-ink-muted">{subtitle}</p>}
                    </div>
                    <Link
                        href={href}
                        className="group inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                        View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
                    {books.map((book) => (
                        <BookCard key={book._id} {...book} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShelfSection;
