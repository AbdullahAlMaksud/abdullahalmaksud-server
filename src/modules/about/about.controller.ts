import type { Context } from "hono";

import { isAuthDatabaseConnected } from "../../lib/database.js";
import type { AppEnv } from "../../lib/types.js";
import { getDefaultAboutData } from "../site/site.defaults.js";
import type { SupportedLocale } from "../site/site.model.js";
import { AboutModel } from "./about.model.js";

const parseLocale = (raw?: string | null): SupportedLocale => {
  return raw === "bn" ? "bn" : "en";
};

const getAboutKey = (locale: SupportedLocale) => (locale === "bn" ? "main_bn" : "main");

const ensureAboutDoc = async (locale: SupportedLocale) => {
  const key = getAboutKey(locale);
  let about = await AboutModel.findOne({ key });
  if (!about) {
    const defaults = getDefaultAboutData(locale);
    about = await AboutModel.findOneAndUpdate(
      { key },
      { $setOnInsert: defaults },
      { upsert: true, returnDocument: "after" },
    );
  }
  return about;
};

export const getAboutData = async (c: Context<AppEnv>) => {
  if (!isAuthDatabaseConnected()) {
    return c.json({ success: false, message: "Database is disconnected." }, 503);
  }

  try {
    const locale = parseLocale(c.req.query("locale"));
    const about = await ensureAboutDoc(locale);

    return c.json({
      success: true,
      data: about,
      locale,
      header: about.header,
      pillars: about.pillars || [],
      principles: about.principles || [],
      experience: about.experience || [],
      education: about.education || [],
      skillsCategories: about.skillsCategories || [],
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateAboutData = async (c: Context<AppEnv>) => {
  if (!isAuthDatabaseConnected()) {
    return c.json({ success: false, message: "Database is disconnected." }, 503);
  }

  try {
    const locale = parseLocale(c.req.query("locale"));
    const key = getAboutKey(locale);
    const body = (await c.req.json()) as Record<string, unknown>;
    const { id: _id, _id: _mongoId, __v: _v, createdAt: _c, updatedAt: _u, ...rest } = body;

    const about = await AboutModel.findOneAndUpdate(
      { key },
      { $set: { ...rest, key, locale } },
      { returnDocument: "after", upsert: true },
    );
    return c.json({ success: true, data: about });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
