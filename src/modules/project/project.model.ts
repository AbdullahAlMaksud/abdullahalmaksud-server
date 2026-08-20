import mongoose, { Schema, type Model } from "mongoose";

const CoreFeatureSchema = new Schema({
  icon: { type: String, default: "" },
  text: { type: String, required: true },
  desc: { type: String, required: true },
});

const ProjectSchema = new Schema(
  {
    index: { type: String, default: "" },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    image: { type: String, default: "" },
    imageBg: { type: String, default: "#0F131A" },
    barColor: { type: String, default: "#E5A93C" },
    logo: { type: String, default: "" },
    tags: [{ type: String }],
    stack: [{ type: String }],
    gitRepo: { type: String, default: "" },
    github: { type: String, default: "" },
    repo: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    link: { type: String, default: "" },
    demo: { type: String, default: "" },
    categories: [{ type: String }],
    category: { type: String, default: "" },
    tag: { type: String, default: "" },
    year: { type: String, default: "2025" },
    status: {
      type: String,
      enum: ["live", "case-study", "prototype", "archived", "building"],
      default: "live",
    },
    featured: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    coreFeatures: [CoreFeatureSchema],
    createdAt: { type: String },
    lastUpdate: { type: String },
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

// Middleware to sync duplicate/helper fields before saving
ProjectSchema.pre("save", function (this: any) {
  if (this.coverImage && !this.image) this.image = this.coverImage;
  if (this.image && !this.coverImage) this.coverImage = this.image;

  if (this.tags && this.tags.length > 0 && (!this.stack || this.stack.length === 0)) {
    this.stack = this.tags;
  }
  if (this.stack && this.stack.length > 0 && (!this.tags || this.tags.length === 0)) {
    this.tags = this.stack;
  }

  if (this.gitRepo && !this.github) this.github = this.gitRepo;
  if (this.github && !this.gitRepo) this.gitRepo = this.github;
  if (this.gitRepo && !this.repo) this.repo = this.gitRepo;

  if (this.liveLink && !this.link) this.link = this.liveLink;
  if (this.link && !this.liveLink) this.liveLink = this.link;
  if (this.liveLink && !this.demo) this.demo = this.liveLink;

  if (this.isFeatured !== undefined && this.featured === undefined) this.featured = this.isFeatured;
  if (this.featured !== undefined && this.isFeatured === undefined) this.isFeatured = this.featured;

  if (this.categories && this.categories.length > 0 && !this.category) {
    this.category = this.categories[0] || "";
  }
  if (this.category && (!this.categories || this.categories.length === 0)) {
    this.categories = [this.category];
  }

  this.isArchived = this.status === "archived";

  const todayStr = new Date().toISOString().split("T")[0];
  if (!this.createdAt) {
    this.createdAt = todayStr;
  }
  this.lastUpdate = todayStr;
});

export const ProjectModel: Model<any> =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
