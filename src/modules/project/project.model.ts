import mongoose, { Schema, type Model } from "mongoose";

const CoreFeatureSchema = new Schema({
  icon: { type: String, default: "" },
  text: { type: String, required: true },
  desc: { type: String, required: true },
});

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    image: { type: String, default: "" },
    logo: { type: String, default: "" },
    stack: [{ type: String }],
    gitRepo: { type: String, default: "" },
    repo: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    demo: { type: String, default: "" },
    categories: [{ type: String }],
    category: { type: String, default: "" },
    tag: { type: String, default: "" },
    year: { type: String, default: "" },
    status: {
      type: String,
      enum: ["live", "case-study", "prototype", "archived"],
      default: "live",
    },
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
ProjectSchema.pre("save", function (this: any, next: any) {
  if (this.coverImage && !this.image) this.image = this.coverImage;
  if (this.image && !this.coverImage) this.coverImage = this.image;

  if (this.gitRepo && !this.repo) this.repo = this.gitRepo;
  if (this.repo && !this.gitRepo) this.gitRepo = this.repo;

  if (this.liveLink && !this.demo) this.demo = this.liveLink;
  if (this.demo && !this.liveLink) this.liveLink = this.demo;

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

  next();
});

export const ProjectModel: Model<any> = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
