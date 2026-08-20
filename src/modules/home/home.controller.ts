import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { HomeModel } from "./home.model.js";
import defaultHomeData from "../../data/home.json" with { type: "json" };

export const getHomeData = async (c: Context<AppEnv>) => {
  try {
    const home = await HomeModel.findOne({ key: "main" });
    if (!home) {
      return c.json(defaultHomeData);
    }

    return c.json({
      hero: home.hero,
      about: home.about,
      featuredProjects: home.featuredProjects,
      books: home.books,
      writing: home.writing,
      quote: home.quote,
      graphicDesign: home.graphicDesign,
      contact: home.contact,
      footer: home.footer,
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateHomeData = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();
    const home = await HomeModel.findOneAndUpdate(
      { key: "main" },
      { $set: body },
      { new: true, upsert: true }
    );
    return c.json({ success: true, data: home });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
