export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectToDB";
import { isValidId, serialize } from "@/lib/queries";
import Book from "../../../../../models/book";
import Library, { READING_STATUSES } from "../../../../../models/library";

type Context = { params: Promise<{ bookId: string }> };

/** Update reading status and/or page progress for a shelved book. */
export async function PATCH(req: Request, context: Context) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bookId } = await context.params;
        if (!isValidId(bookId)) {
            return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
        }

        const body = await req.json();
        await connectToDatabase();

        const entry = await Library.findOne({ userId, book: bookId });
        if (!entry) {
            return NextResponse.json({ error: "Book is not in your library" }, { status: 404 });
        }
        const book = await Book.findById(bookId).select("pages").lean<{ pages: number }>();
        const totalPages = book?.pages ?? 0;
        const now = new Date();

        if (body.currentPage !== undefined) {
            const page = Math.round(Number(body.currentPage));
            if (!Number.isFinite(page) || page < 0) {
                return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
            }
            entry.currentPage = totalPages ? Math.min(page, totalPages) : page;

            // Progress implies a status: starting a book moves it to "reading",
            // reaching the last page finishes it.
            if (totalPages && entry.currentPage >= totalPages) {
                entry.status = "finished";
            } else if (entry.currentPage > 0 && entry.status !== "reading") {
                entry.status = "reading";
            }
        }

        if (body.status !== undefined) {
            if (!READING_STATUSES.includes(body.status)) {
                return NextResponse.json({ error: "Invalid status" }, { status: 400 });
            }
            entry.status = body.status;
            if (body.status === "finished") entry.currentPage = totalPages;
            if (body.status === "want-to-read") entry.currentPage = 0;
        }

        if (entry.status === "reading" && !entry.startedAt) entry.startedAt = now;
        if (entry.status === "finished") {
            entry.startedAt ??= now;
            entry.finishedAt ??= now;
        } else {
            entry.finishedAt = undefined;
        }

        await entry.save();
        return NextResponse.json({ entry: serialize(entry) });
    } catch (error) {
        console.error("Error updating library entry:", error);
        return NextResponse.json({ error: "Failed to update library entry" }, { status: 500 });
    }
}

/** Remove a book from the signed-in user's library. */
export async function DELETE(req: Request, context: Context) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bookId } = await context.params;
        if (!isValidId(bookId)) {
            return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
        }

        await connectToDatabase();
        const removed = await Library.findOneAndDelete({ userId, book: bookId });
        if (!removed) {
            return NextResponse.json({ error: "Book is not in your library" }, { status: 404 });
        }

        await Book.updateOne(
            { _id: bookId, readersCount: { $gt: 0 } },
            { $inc: { readersCount: -1 } }
        );

        return NextResponse.json({ message: "Removed from library" });
    } catch (error) {
        console.error("Error removing library entry:", error);
        return NextResponse.json({ error: "Failed to remove book" }, { status: 500 });
    }
}
