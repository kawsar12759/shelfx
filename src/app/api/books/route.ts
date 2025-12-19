import { connectToDatabase } from "@/lib/connectToDB";
import { auth, currentUser } from "@clerk/nextjs/server";
import Book from "../../../../models/book";
import { error } from "console";
import { Upload } from "lucide-react";
import { UploadImage } from "@/lib/upload-image";

export async function POST(req: Request) {
    try {
        const { isAuthenticated } = await auth();
        if (!isAuthenticated) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();

        const user = await currentUser();
        const formData = await req.formData();
        console.log(formData);

        const title = formData.get("title")?.toString() || "";
        const author = formData.get("author")?.toString() || "";
        const genre = formData.get("genre")?.toString() || "";
        const summary = formData.get("summary")?.toString() || "";
        const language = formData.get("language")?.toString() || "";
        const publishedYearData = formData.get("publishedYear")?.toString() || "";
        const pagesData = formData.get("pages")?.toString() || "";
        const pages = pagesData ? Number(pagesData) : undefined;

        const publishedYear = publishedYearData ? Number(publishedYearData) : undefined;
        const cover = formData.get("cover") as File;
        if (!title || !author || !cover || !genre || !summary || !language || !publishedYear || !pages) {
            return Response.json(
                {
                    error:
                        "Please fill in all the required fields"
                },
                { status: 400 }
            )
        }

        let uploadResult: any;

        if (cover) {
            uploadResult = await UploadImage(cover, "ShelfX");
        }
        console.log(uploadResult);
        const book = await Book.create({
            title, author, cover: uploadResult?.secure_url || cover.name, genre, summary, publishedYear, pages, language, addedBy: { id: user?.id, firstName: user?.firstName }
        })

        return Response.json({ book }, { status: 201 })
    } catch (error) {
        console.error("Error creating book:", error);
        return Response.json({ error: "Failed to create book" }, { status: 500 })
    }
}