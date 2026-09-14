import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    cover: { type: String, required: true },
    genre: { type: [String], required: true },
    summary: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    pages: { type: Number, required: true },
    language: { type: String, required: true },
    addedBy: {
        id: { type: String, required: true },
        firstName: { type: String, required: true },
    },
    // Denormalized counters, kept in sync by the review and library routes
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    readersCount: { type: Number, default: 0 },
}, { timestamps: true });

BookSchema.index({ createdAt: -1 });
BookSchema.index({ genre: 1 });

const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);

export default Book;
