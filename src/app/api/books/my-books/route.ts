export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/connectToDB";
import Book from "../../../../../models/book";

export async function GET() {
  try {
    const { userId } = await auth();
    console.log(userId);
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const books = await Book.find({ "addedBy.id": userId }).sort({ createdAt: -1 });

    return Response.json({ books }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user added books:", error);
    return Response.json({ error: "Failed to fetch user's added books" }, { status: 500 });
  }
}