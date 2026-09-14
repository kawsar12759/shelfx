import mongoose from "mongoose";
import { connectToDatabase } from "./connectToDB";
import { SortOption } from "./genres";
import Book from "../../models/book";
import Library from "../../models/library";
import Review from "../../models/review";

/** Converts lean Mongoose docs (ObjectIds, Dates) into plain JSON-safe objects. */
export function serialize<T>(doc: unknown): T {
    return JSON.parse(JSON.stringify(doc)) as T;
}

export function isValidId(id: unknown): id is string {
    return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SORTS: Record<SortOption, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    rating: { ratingAvg: -1, ratingCount: -1, createdAt: -1 },
    popular: { readersCount: -1, createdAt: -1 },
    title: { title: 1 },
};

export type BookSearchParams = {
    q?: string | null;
    genre?: string | null;
    sort?: string | null;
    page?: number;
    limit?: number;
};

export async function searchBooks({ q, genre, sort, page = 1, limit = 12 }: BookSearchParams) {
    await connectToDatabase();

    const filter: Record<string, unknown> = {};
    const cleanGenre = genre?.replace(/^"(.*)"$/, "$1");
    if (cleanGenre && cleanGenre !== "All") filter.genre = cleanGenre;

    const term = q?.trim();
    if (term) {
        const rx = new RegExp(escapeRegex(term), "i");
        filter.$or = [{ title: rx }, { author: rx }];
    }

    const sortKey = (sort && sort in SORTS ? sort : "newest") as SortOption;
    const safeLimit = Math.min(Math.max(limit, 1), 48);
    const safePage = Math.max(page, 1);

    const [books, total] = await Promise.all([
        Book.find(filter)
            .collation({ locale: "en" })
            .sort(SORTS[sortKey])
            .skip((safePage - 1) * safeLimit)
            .limit(safeLimit)
            .lean(),
        Book.countDocuments(filter),
    ]);

    return {
        books: serialize<Book[]>(books),
        total,
        page: safePage,
        totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    };
}

export async function getBookById(id: string) {
    if (!isValidId(id)) return null;
    await connectToDatabase();
    const book = await Book.findById(id).lean();
    return book ? serialize<Book>(book) : null;
}

/** Books sharing at least one genre (or the same author), best-rated first. */
export async function getSimilarBooks(book: Book, limit = 4) {
    await connectToDatabase();
    const books = await Book.find({
        _id: { $ne: book._id },
        $or: [{ genre: { $in: book.genre } }, { author: book.author }],
    })
        .sort({ ratingAvg: -1, readersCount: -1, createdAt: -1 })
        .limit(limit)
        .lean();
    return serialize<Book[]>(books);
}

export async function getTopRatedBooks(limit = 4) {
    await connectToDatabase();
    const books = await Book.find({ ratingCount: { $gt: 0 } })
        .sort({ ratingAvg: -1, ratingCount: -1 })
        .limit(limit)
        .lean();
    return serialize<Book[]>(books);
}

export async function getRecentBooks(limit = 8) {
    await connectToDatabase();
    const books = await Book.find().sort({ createdAt: -1 }).limit(limit).lean();
    return serialize<Book[]>(books);
}

export async function getSiteStats() {
    await connectToDatabase();
    const [books, reviews, readers, genres] = await Promise.all([
        Book.countDocuments(),
        Review.countDocuments(),
        Library.distinct("userId"),
        Book.aggregate<{ _id: string; count: number }>([
            { $unwind: "$genre" },
            { $group: { _id: "$genre", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
    ]);
    return {
        books,
        reviews,
        readers: readers.length,
        genres: genres.map((g) => ({ name: g._id, count: g.count })),
    };
}

/** Recalculates the denormalized rating fields on a book from its reviews. */
export async function recomputeBookRating(bookId: string) {
    const [agg] = await Review.aggregate<{ avg: number; count: number }>([
        { $match: { book: new mongoose.Types.ObjectId(bookId) } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    await Book.updateOne(
        { _id: bookId },
        {
            ratingAvg: agg ? Math.round(agg.avg * 10) / 10 : 0,
            ratingCount: agg?.count ?? 0,
        }
    );
}
