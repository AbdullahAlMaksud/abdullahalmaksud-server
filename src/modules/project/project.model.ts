import mongoose, { Schema, type Model } from "mongoose";

const CoreFeatureSchema = new Schema(
  {
    icon: { type: String, default: "" },
    text: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    logo: { type: String, default: "" },
    imageBg: { type: String, default: "#0F131A" },
    barColor: { type: String, default: "#E5A93C" },
    screenshots: [{ type: String }],
    tags: [{ type: String }],
    stack: [{ type: String }],
    category: { type: String, default: "" },
    github: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    year: {
      type: String,
      default: () => new Date().getFullYear().toString(),
    },
    status: {
      type: String,
      enum: ["live", "case-study", "prototype", "archived", "building"],
      default: "live",
    },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    coreFeatures: [CoreFeatureSchema],
    content: { type: Schema.Types.Mixed, default: null },
    contentType: {
      type: String,
      enum: ["blocks", "lexical", "json", "markdown", "html"],
      default: "blocks",
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    createdAtDate: { type: String },
    lastUpdate: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : "";
        // Backward-compatibility aliases for legacy web client
        ret.image = ret.coverImage || "";
        ret.gitRepo = ret.github || "";
        ret.repo = ret.github || "";
        ret.link = ret.liveLink || "";
        ret.demo = ret.liveLink || "";
        ret.isFeatured = ret.featured || false;
        ret.isArchived = ret.status === "archived";
        ret.categories = ret.category ? [ret.category] : [];
        ret.index = ret.sortOrder !== undefined ? String(ret.sortOrder) : "0";
        ret.fullContent = ret.content || ret.longDescription || "";
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook to normalize incoming legacy aliases to canonical fields
ProjectSchema.pre("save", function (this: any) {
  // Sync image aliases
  if (this.image && !this.coverImage) this.coverImage = this.image;

  // Sync github/repo aliases
  if (this.gitRepo && !this.github) this.github = this.gitRepo;
  if (this.repo && !this.github) this.github = this.repo;

  // Sync live link aliases
  if (this.link && !this.liveLink) this.liveLink = this.link;
  if (this.demo && !this.liveLink) this.liveLink = this.demo;

  // Sync featured aliases
  if (this.isFeatured !== undefined && this.featured === undefined) {
    this.featured = this.isFeatured;
  }

  // Sync category aliases
  if (this.categories && this.categories.length > 0 && !this.category) {
    this.category = this.categories[0];
  }

  // Sync tags / stack
  if (this.tags && this.tags.length > 0 && (!this.stack || this.stack.length === 0)) {
    this.stack = this.tags;
  }
  if (this.stack && this.stack.length > 0 && (!this.tags || this.tags.length === 0)) {
    this.tags = this.stack;
  }

  // Sync index to sortOrder
  if (this.index !== undefined && this.sortOrder === 0) {
    const parsed = Number(this.index);
    if (!isNaN(parsed)) this.sortOrder = parsed;
  }

  const todayStr = new Date().toISOString().split("T")[0];
  if (!this.createdAtDate) {
    this.createdAtDate = todayStr;
  }
  this.lastUpdate = todayStr;
});

export const ProjectModel: Model<any> =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
