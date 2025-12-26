export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/connectToDB";
import Book from "../../../../../../models/book";
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

    if (!id) {
        return NextResponse.json({ error: "Book ID missing" }, { status: 400 });
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

    await Book.deleteOne({ _id: id });

    return NextResponse.json({ message: "Book deleted successfully" });
}
