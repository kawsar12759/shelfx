export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectToDB";
import { isValidId, serialize } from "@/lib/queries";
import Book from "../../../../../models/book";
import library, { READING_STATUSES } from "../../../../../models/library";


export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const { bookId, status } = await req.json();

    if (!isValidId(bookId)) {
      return NextResponse.json(
        { error: "A valid book ID is required" },
        { status: 400 }
      );
    }

    const initialStatus = READING_STATUSES.includes(status) ? status : "want-to-read";

    await connectToDatabase();

    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    const alreadyAdded = await library.findOne({
      userId,
      book: bookId,
    }).lean();

    if (alreadyAdded) {
      return NextResponse.json(
        { message: "Book already in library", entry: serialize(alreadyAdded) },
        { status: 200 }
      );
    }

    const now = new Date();
    const libraryItem = await library.create({
      userId,
      userName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
      book: bookId,
      status: initialStatus,
      startedAt: initialStatus !== "want-to-read" ? now : undefined,
      finishedAt: initialStatus === "finished" ? now : undefined,
      currentPage: initialStatus === "finished" ? bookExists.pages : 0,
    });

    await Book.updateOne({ _id: bookId }, { $inc: { readersCount: 1 } });

    return NextResponse.json(
      {
        message: "Book added to library",
        entry: serialize(libraryItem),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding book to library:", error);
    return NextResponse.json(
      { error: "Failed to add book to library" },
      { status: 500 }
    );
  }
}
