import mongoose, { Schema, type Model } from "mongoose";

const CaseStudyResultSchema = new Schema(
  {
    metric: { type: String, required: true },
    value: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const CaseStudySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },

    // Lexical Editor block-based content (or markdown fallback)
    content: { type: Schema.Types.Mixed, default: null },
    contentType: {
      type: String,
      enum: ["lexical", "markdown", "html"],
      default: "lexical",
    },

    // Media & Visuals
    coverImage: { type: String, default: "" },
    screenshots: [{ type: String }],

    // Relation to Project
    projectSlug: { type: String, default: "" },

    // Categorization
    tags: [{ type: String }],
    category: { type: String, default: "Architecture" },
    industry: { type: String, default: "" },
    client: { type: String, default: "" },

    // Core Case Study Anatomy: Challenge, Solution, Results
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    results: [CaseStudyResultSchema],

    // Technical Details & Execution
    stack: [{ type: String }],
    duration: { type: String, default: "" },
    readingTime: { type: String, default: "8 min read" },

    // Publishing
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },

    // SEO
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
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

CaseStudySchema.pre("save", function (this: any) {
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date().toISOString().split("T")[0];
  }
});

export const CaseStudyModel: Model<any> =
  mongoose.models.CaseStudy || mongoose.model("CaseStudy", CaseStudySchema);
