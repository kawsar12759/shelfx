import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
            index: true,
        },
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        userImage: { type: String },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, default: "", maxlength: 2000 },
    },
    { timestamps: true }
);
ReviewSchema.index({ book: 1, userId: 1 }, { unique: true });

export default mongoose.models.Review ||
    mongoose.model("Review", ReviewSchema);
