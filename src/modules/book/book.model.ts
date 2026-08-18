import mongoose, { Schema, type Model } from "mongoose";

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    coverImage: { type: String, default: "" },
    description: { type: String, default: "" },
    genre: { type: String, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    readDate: { type: String, default: "" },
    reviewText: { type: String, default: "" },
    tags: [{ type: String }],
    isRecommended: { type: Boolean, default: false },
    purchaseLink: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : "";
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const BookModel: Model<any> =
  mongoose.models.Book || mongoose.model("Book", BookSchema);
