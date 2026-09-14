import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getBookById, getSimilarBooks } from "@/lib/queries";
import BookDetails from "../../../../components/BookDetails";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ bookId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const book = await getBookById((await params).bookId);
    if (!book) return { title: "Book not found" };

    const description = book.summary.length > 160 ? `${book.summary.slice(0, 157)}…` : book.summary;
    return {
        title: `${book.title} by ${book.author}`,
        description,
        openGraph: {
            title: `${book.title} by ${book.author}`,
            description,
            images: [{ url: book.cover }],
        },
    };
}

export default async function BookPage({ params }: PageProps) {
    const { bookId } = await params;
    const book = await getBookById(bookId);
    if (!book) notFound();

    const [similar, { userId }] = await Promise.all([getSimilarBooks(book), auth()]);

    return <BookDetails book={book} similar={similar} isOwner={userId === book.addedBy?.id} />;
}
