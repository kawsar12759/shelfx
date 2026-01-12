export const runtime = "nodejs";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectToDB";

import mongoose from "mongoose";
import library from "../../../../../../models/library";

export async function GET(
    req: Request,
    context: { params: Promise<{ bookId: string }> }
) {
    try {
        const { userId } = await auth();
        const { bookId } = await context.params;

        if (!userId) {
            return NextResponse.json({ added: false });
        }
        console.log(bookId, "aaa");
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return NextResponse.json({ added: false });
        }

        await connectToDatabase();

        const exists = await library.findOne({
            userId,
            book:bookId,
        }).lean();
        console.log(exists,"sass")
        return NextResponse.json({ added: !!exists });
    } catch (err) {
        console.error("Library status error:", err);
        return NextResponse.json({ added: false });
    }
}
