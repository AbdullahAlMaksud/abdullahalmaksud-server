import mongoose, { Schema, type Model } from "mongoose";

const AboutSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    header: { type: Schema.Types.Mixed, required: true },
    pillars: [{ type: Schema.Types.Mixed }],
    experience: [{ type: Schema.Types.Mixed }],
    education: [{ type: Schema.Types.Mixed }],
    skillsCategories: [{ type: Schema.Types.Mixed }],
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

export const AboutModel: Model<any> =
  mongoose.models.About || mongoose.model("About", AboutSchema);
