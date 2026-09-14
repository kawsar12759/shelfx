export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/connectToDB";
import { isValidId } from "@/lib/queries";
import Book from "../../../../../../models/book";
import Library from "../../../../../../models/library";
import Review from "../../../../../../models/review";
import { NextResponse } from "next/server";


export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!isValidId(id)) {
        return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    await connectToDatabase();

    const book = await Book.findOne({
        _id: id,
        "addedBy.id": userId,
    });

    if (!book) {
        return NextResponse.json(
            { error: "Book not found or not authorized" },
            { status: 404 }
        );
    }

    // Remove the book along with every shelf entry and review that points at it
    await Promise.all([
        Book.deleteOne({ _id: id }),
        Library.deleteMany({ book: id }),
        Review.deleteMany({ book: id }),
    ]);

    return NextResponse.json({ message: "Book deleted successfully" });
}
