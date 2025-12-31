import mongoose from "mongoose";

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
        },
    },
    { timestamps: true }
);

export default mongoose.models.Library ||
    mongoose.model("Library", LibrarySchema);
