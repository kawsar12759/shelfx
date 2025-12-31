export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectToDB";
import Book from "../../../../../models/book";
import library from "../../../../../models/library";


export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const { bookId } = await req.json();

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

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
    });

    if (alreadyAdded) {
      return NextResponse.json(
        { message: "Book already in library" },
        { status: 200 }
      );
    }

    const libraryItem = await library.create({
      userId,
      userName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
      book: bookId,
    });

    return NextResponse.json(
      {
        message: "Book added to library",
        libraryItem,
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
