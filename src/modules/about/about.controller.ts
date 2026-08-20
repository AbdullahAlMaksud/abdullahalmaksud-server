import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { AboutModel } from "./about.model.js";
import defaultAboutData from "../../data/about.json" with { type: "json" };

export const getAboutData = async (c: Context<AppEnv>) => {
  try {
    const about = await AboutModel.findOne({ key: "main" });
    if (!about) {
      return c.json(defaultAboutData);
    }

    return c.json({
      header: about.header,
      pillars: about.pillars,
      experience: about.experience,
      education: about.education,
      skillsCategories: about.skillsCategories,
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateAboutData = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();
    const about = await AboutModel.findOneAndUpdate(
      { key: "main" },
      { $set: body },
      { new: true, upsert: true }
    );
    return c.json({ success: true, data: about });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
