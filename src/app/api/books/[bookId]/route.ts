import { getBookById } from "@/lib/queries";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ bookId: string }> }
) {
    try {
        const { bookId } = await params;
        const book = await getBookById(bookId);

        if (!book) {
            return Response.json({ error: "Book not found" }, { status: 404 });
        }

        return Response.json(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        return Response.json({ error: "Failed to fetch book" }, { status: 500 });
    }
}
