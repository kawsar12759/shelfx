export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectToDB";
import Book from "../../../../../../models/book";
import { UploadImage } from "@/lib/upload-image";


export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Book ID missing" }, { status: 400 });
    }

    const formData = await req.formData();

    const title = formData.get("title")?.toString() || undefined;
    const author = formData.get("author")?.toString() || undefined;
    const summary = formData.get("summary")?.toString() || undefined;
    const language = formData.get("language")?.toString() || undefined;

    const publishedYear = formData.get("publishedYear")
      ? Number(formData.get("publishedYear"))
      : undefined;

    const pages = formData.get("pages")
      ? Number(formData.get("pages"))
      : undefined;

    const genreRaw = formData.getAll("genre[]").map((g) => g.toString());
    const genre = genreRaw.length > 0 ? genreRaw : undefined;

    const coverFile = formData.get("cover") as File | null;

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

    if (title) book.title = title;
    if (author) book.author = author;
    if (summary) book.summary = summary;
    if (language) book.language = language;
    if (publishedYear !== undefined) book.publishedYear = publishedYear;
    if (pages !== undefined) book.pages = pages;
    if (genre) book.genre = genre;

    if (coverFile && coverFile.size > 0) {
      const uploadResult = await UploadImage(coverFile, "ShelfX");
      if (uploadResult?.secure_url) {
        book.cover = uploadResult.secure_url;
      }
    }

    await book.save();

    return NextResponse.json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}
