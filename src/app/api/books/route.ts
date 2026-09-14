import { connectToDatabase } from "@/lib/connectToDB";
import { auth, currentUser } from "@clerk/nextjs/server";
import Book from "../../../../models/book";
import { UploadImage, validateCover } from "@/lib/upload-image";
import { searchBooks } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
    try {
        const { isAuthenticated } = await auth();
        if (!isAuthenticated) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();

        const user = await currentUser();
        const formData = await req.formData();

        const title = formData.get("title")?.toString().trim() || "";
        const author = formData.get("author")?.toString().trim() || "";
        const genre = formData.getAll("genre[]").map((g) => g.toString());
        const summary = formData.get("summary")?.toString().trim() || "";
        const language = formData.get("language")?.toString().trim() || "";
        const publishedYearData = formData.get("publishedYear")?.toString() || "";
        const pagesData = formData.get("pages")?.toString() || "";
        const pages = pagesData ? Number(pagesData) : undefined;

        const publishedYear = publishedYearData ? Number(publishedYearData) : undefined;
        const cover = formData.get("cover");
        if (!title || !author || !(cover instanceof File) || genre.length === 0 || !summary || !language || !publishedYear || !pages) {
            return Response.json(
                {
                    error:
                        "Please fill in all the required fields"
                },
                { status: 400 }
            )
        }

        const coverError = validateCover(cover);
        if (coverError) {
            return Response.json({ error: coverError }, { status: 400 });
        }

        const uploadResult = await UploadImage(cover, "ShelfX");
        const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Reader";

        const book = await Book.create({
            title, author, cover: uploadResult.secure_url, genre, summary, publishedYear, pages, language, addedBy: { id: user?.id, firstName: displayName }
        })
        return Response.json({ book }, { status: 201 })
    } catch (error) {
        console.error("Error creating book:", error);
        return Response.json({ error: "Failed to create book" }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const result = await searchBooks({
            q: params.get("q"),
            genre: params.get("genre"),
            sort: params.get("sort"),
            page: Number(params.get("page")) || 1,
            limit: Number(params.get("limit")) || 12,
        });

        return Response.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching books:", error);
        return Response.json({ error: "Failed to fetch books" }, { status: 500 });
    }
}
