import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getBookById } from "@/lib/queries";
import BookForm from "../../../../components/book-form/BookForm";
import SectionHeader from "../../../../components/SectionHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Edit book",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBookPage({ params }: PageProps) {
    const { id } = await params;
    const [book, { userId }] = await Promise.all([getBookById(id), auth()]);

    // Only the reader who added a book can edit it; everyone else gets a 404
    if (!book || book.addedBy?.id !== userId) notFound();

    return (
        <section className="mx-auto max-w-5xl space-y-12 px-5 pt-12 md:pt-16">
            <SectionHeader
                as="h1"
                title={<>Edit <span className="italic text-ink-muted">{book.title}</span></>}
                subtitle="Update the details readers see on this book's page."
                className="border-b border-line pb-10"
            />
            <BookForm
                mode="edit"
                bookId={book._id}
                initialCover={book.cover}
                initial={{
                    title: book.title,
                    author: book.author,
                    summary: book.summary,
                    publishedYear: String(book.publishedYear ?? ""),
                    pages: String(book.pages ?? ""),
                    language: book.language ?? "",
                    genre: Array.isArray(book.genre) ? book.genre.filter(Boolean) : [],
                }}
            />
        </section>
    );
}
