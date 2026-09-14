export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectToDB";
import { serialize } from "@/lib/queries";
import Library from "../../../../models/library";
// Registers the Book model so populate() can resolve it
import "../../../../models/book";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const entries = await Library.find({ userId })
            .sort({ updatedAt: -1 })
            .populate("book")
            .lean();

        // Skip entries whose book was deleted before cascading deletes existed
        // and backfill defaults for entries created before reading status existed
        const items = serialize<LibraryEntry[]>(entries)
            .filter((e) => e.book)
            .map((e) => ({ ...e, status: e.status ?? "want-to-read", currentPage: e.currentPage ?? 0 }));

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Error fetching library:", error);
        return NextResponse.json({ error: "Failed to fetch library" }, { status: 500 });
    }
}
