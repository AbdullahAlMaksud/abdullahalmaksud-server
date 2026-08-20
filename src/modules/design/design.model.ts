import mongoose, { Schema, type Model } from "mongoose";

const DesignSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    coverImage: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Visual Identity" },
    bg: { type: String, default: "#0A0D14" },
    tools: [{ type: String }],
    link: { type: String, default: "#" },
    featured: { type: Boolean, default: false },
    year: { type: String, default: "2025" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: Record<string, any>) => {
        ret.id = ret.id || (ret._id ? ret._id.toString() : "");
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const DesignModel: Model<any> =
  mongoose.models.Design || mongoose.model("Design", DesignSchema);
