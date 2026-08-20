import mongoose, { Schema, type Model } from "mongoose";

const FeaturedBookSchema = new Schema(
  {
    titleBn: { type: String, default: "এমন যদি হতো" },
    titleEn: { type: String, default: "Emon Jodi Hoto" },
    title: { type: String, default: "এমন যদি হতো" },
    author: { type: String, default: "আব্দুল্লাহ আল মাকসুদ" },
    publisher: { type: String, default: "জ্ঞানকোষ প্রকাশনী" },
    category: { type: String, default: "বিজ্ঞান ও প্রযুক্তি" },
    ageGroup: { type: String, default: "বয়স ১২-১৭" },
    cover: { type: String, default: "/images/books/emon-jodi-hoto.webp" },
    coverImage: { type: String, default: "/images/books/emon-jodi-hoto.webp" },
    price: { type: Number, default: 344 },
    rokomariUrl: {
      type: String,
      default: "https://www.rokomari.com/book/454540/emon-jodi-hoto",
    },
    purchaseLink: {
      type: String,
      default: "https://www.rokomari.com/book/454540/emon-jodi-hoto",
    },
    descriptionBn: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    description: { type: String, default: "" },
    year: { type: Number, default: 2025 },
  },
  { _id: false }
);

const BookStatSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const ShelfBookSchema = new Schema(
  {
    id: { type: String, required: true },
    slug: { type: String, default: "" },
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverColor: { type: String, default: "#F5F3EF" },
    textColor: { type: String, default: "#2B2824" },
    accentColor: { type: String, default: "#D97706" },
    coverImage: { type: String, default: "" },
    tag: { type: String, default: "" },
    genre: { type: String, default: "" },
    year: { type: Number, default: 2024 },
  },
  { _id: false }
);

const BookBundleSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    book: { type: FeaturedBookSchema, required: true },
    stats: [BookStatSchema],
    books: [ShelfBookSchema],
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

// Individual Book Schema for standalone book records
const StandaloneBookSchema = new Schema(
  {
    title: { type: String, required: true },
    titleBn: { type: String },
    titleEn: { type: String },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    coverImage: { type: String, default: "" },
    cover: { type: String, default: "" },
    coverColor: { type: String, default: "#F5F3EF" },
    textColor: { type: String, default: "#2B2824" },
    accentColor: { type: String, default: "#D97706" },
    description: { type: String, default: "" },
    descriptionBn: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    genre: { type: String, default: "" },
    category: { type: String, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 5 },
    year: { type: Number, default: 2025 },
    price: { type: Number, default: 0 },
    rokomariUrl: { type: String, default: "" },
    purchaseLink: { type: String, default: "" },
    publisher: { type: String, default: "" },
    tag: { type: String, default: "" },
    tags: [{ type: String }],
    isRecommended: { type: Boolean, default: true },
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

export const BookBundleModel: Model<any> =
  mongoose.models.BookBundle || mongoose.model("BookBundle", BookBundleSchema);

export const BookModel: Model<any> =
  mongoose.models.Book || mongoose.model("Book", StandaloneBookSchema);
