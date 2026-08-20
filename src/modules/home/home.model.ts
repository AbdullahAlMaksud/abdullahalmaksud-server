import mongoose, { Schema, type Model } from "mongoose";

const HomeSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    hero: { type: Schema.Types.Mixed, required: true },
    about: { type: Schema.Types.Mixed, required: true },
    featuredProjects: { type: Schema.Types.Mixed, required: true },
    books: { type: Schema.Types.Mixed, required: true },
    writing: { type: Schema.Types.Mixed, required: true },
    quote: { type: Schema.Types.Mixed, required: true },
    graphicDesign: { type: Schema.Types.Mixed, required: true },
    contact: { type: Schema.Types.Mixed, required: true },
    footer: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: Record<string, any>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const HomeModel: Model<any> =
  mongoose.models.Home || mongoose.model("Home", HomeSchema);
