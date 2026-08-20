import mongoose, { Schema, type Model } from "mongoose";

const AuthorSchema = new Schema(
  {
    name: { type: String, default: "Abdullah Al Maksud" },
    avatar: { type: String, default: "/images/avatar.jpg" },
    bio: { type: String, default: "Developer, designer, writer." },
  },
  { _id: false }
);

const BlogSchema = new Schema(
  {
    id: { type: String },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: Schema.Types.Mixed, default: "" }, // Supports Array of Block objects or Markdown string
    cover: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    author: { type: Schema.Types.Mixed, default: () => ({ name: "Abdullah Al Maksud", avatar: "/images/avatar.jpg", bio: "Developer, designer, writer." }) },
    tags: [{ type: String }],
    category: { type: String, default: "Engineering" },
    readingTime: { type: String, default: "5 min read" },
    featured: { type: Boolean, default: false },
    featuredType: { type: String, enum: ["large", "small", "standard", ""], default: "" },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id || "";
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Auto-sync cover fields and publishedAt before save
BlogSchema.pre("save", function (this: any) {
  if (this.cover && !this.coverImage) this.coverImage = this.cover;
  if (this.coverImage && !this.cover) this.cover = this.coverImage;

  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date().toISOString().split("T")[0];
  }
});

export const BlogModel: Model<any> =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
