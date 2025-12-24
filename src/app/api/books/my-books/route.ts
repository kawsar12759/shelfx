import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/connectToDB";
import Book from "../../../../../models/book";

export async function GET() {
    try {
        const { isAuthenticated } = await auth();
        if (!isAuthenticated) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await currentUser();
        if (!user) {
            return Response.json(
                { error: "User not found" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const books = await Book.find({
            "addedBy.id": user.id,
        }).sort({ createdAt: -1 });

        return Response.json({ books }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user added books:", error);
        return Response.json(
            { error: "Failed to fetch user's added books" },
            { status: 500 }
        );
    }
}
