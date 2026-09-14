export const runtime = "nodejs";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectToDB";
import { isValidId, serialize } from "@/lib/queries";
import library from "../../../../../../models/library";

export async function GET(
    req: Request,
    context: { params: Promise<{ bookId: string }> }
) {
    try {
        const { userId } = await auth();
        const { bookId } = await context.params;

        if (!userId || !isValidId(bookId)) {
            return NextResponse.json({ added: false, entry: null });
        }

        await connectToDatabase();

        const entry = await library.findOne({
            userId,
            book: bookId,
        }).lean();
        return NextResponse.json({ added: !!entry, entry: entry ? serialize(entry) : null });
    } catch (err) {
        console.error("Library status error:", err);
        return NextResponse.json({ added: false, entry: null });
    }
}
