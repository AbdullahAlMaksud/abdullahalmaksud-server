import mongoose, { Schema, type Model } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    author: { type: String, default: "Abdullah Al Maksud" },
    tags: [{ type: String }],
    category: { type: String, default: "" },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: String, default: "" },
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

// Auto-set publishedAt when isPublished becomes true
BlogSchema.pre("save", function (this: any, next: any) {
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date().toISOString().split("T")[0];
  }
  next();
});

export const BlogModel: Model<any> =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
