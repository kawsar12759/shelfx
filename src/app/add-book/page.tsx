import type { Metadata } from "next";
import BookForm from "../../../components/book-form/BookForm";
import SectionHeader from "../../../components/SectionHeader";

export const metadata: Metadata = {
    title: "Add a book",
};

export default function AddBookPage() {
    return (
        <section className="mx-auto max-w-5xl space-y-12 px-5 pt-12 md:pt-16">
            <SectionHeader
                as="h1"
                title="Add a book"
                subtitle="Anything you add is visible to every reader. You can edit or delete it later from My Books."
                className="border-b border-line pb-10"
            />
            <BookForm mode="add" />
        </section>
    );
}
