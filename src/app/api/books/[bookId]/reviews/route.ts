export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectToDB";
import { isValidId, recomputeBookRating, serialize } from "@/lib/queries";
import Book from "../../../../../../models/book";
import Review from "../../../../../../models/review";

type Context = { params: Promise<{ bookId: string }> };

export async function GET(req: Request, context: Context) {
    try {
        const { bookId } = await context.params;
        if (!isValidId(bookId)) {
            return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
        }

        await connectToDatabase();
        const reviews = await Review.find({ book: bookId }).sort({ updatedAt: -1 }).limit(100).lean();

        return NextResponse.json({ reviews: serialize<Review[]>(reviews) });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

/** Create or update the signed-in user's review (one review per user per book). */
export async function POST(req: Request, context: Context) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Please sign in to leave a review" }, { status: 401 });
        }

        const { bookId } = await context.params;
        if (!isValidId(bookId)) {
            return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
        }

        const { rating, text } = await req.json();
        const stars = Number(rating);
        if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }
        const body = typeof text === "string" ? text.trim().slice(0, 2000) : "";

        await connectToDatabase();
        if (!(await Book.exists({ _id: bookId }))) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        const user = await currentUser();
        const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Reader";

        const review = await Review.findOneAndUpdate(
            { book: bookId, userId },
            { rating: stars, text: body, userName, userImage: user?.imageUrl },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();

        await recomputeBookRating(bookId);

        return NextResponse.json({ review: serialize<Review>(review) }, { status: 201 });
    } catch (error) {
        console.error("Error saving review:", error);
        return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
    }
}

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
        const removed = await Review.findOneAndDelete({ book: bookId, userId });
        if (!removed) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        await recomputeBookRating(bookId);
        return NextResponse.json({ message: "Review deleted" });
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}
