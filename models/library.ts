import mongoose from "mongoose";

export const READING_STATUSES = ["want-to-read", "reading", "finished"] as const;

const LibrarySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        userName: {
            type: String,
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: READING_STATUSES,
            default: "want-to-read",
        },
        currentPage: {
            type: Number,
            default: 0,
            min: 0,
        },
        startedAt: { type: Date },
        finishedAt: { type: Date },
    },
    { timestamps: true }
);
LibrarySchema.index({ userId: 1, book: 1 }, { unique: true });

export default mongoose.models.Library ||
    mongoose.model("Library", LibrarySchema);
