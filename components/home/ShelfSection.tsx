import { Button } from "@/components/ui/button";
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
                <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-extrabold text-ink">{title}</h2>
                        {subtitle && <p className="text-ink-muted">{subtitle}</p>}
                    </div>
                    <Button
                        variant="outline"
                        asChild
                        className="rounded-full px-6 text-ink hover:bg-sand/30 hover:text-ink"
                    >
                        <Link href={href}>
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
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
