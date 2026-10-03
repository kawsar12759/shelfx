import BookCard from "../BookCard";
import { BOOK_GRID } from "../BookCardSkeleton";
import SectionHeader from "../SectionHeader";

type ShelfSectionProps = {
    title: string;
    subtitle?: string;
    href: string;
    books: Book[];
};

const ShelfSection = ({ title, subtitle, href, books }: ShelfSectionProps) => {
    if (books.length === 0) return null;

    return (
        <section className="px-5 pt-24">
            <div className="mx-auto max-w-7xl space-y-10">
                <SectionHeader title={title} subtitle={subtitle} link={{ href, label: "View all" }} />
                <div className={BOOK_GRID}>
                    {books.map((book) => (
                        <BookCard key={book._id} {...book} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShelfSection;
