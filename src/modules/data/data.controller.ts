import type { Context } from "hono";

import { getContentData, getSiteData, toLocale } from "../../lib/data.js";
import type { AppEnv } from "../../lib/types.js";

const localeFrom = (c: Context<AppEnv>) => toLocale(c.req.query("locale"));

export const siteController = async (c: Context<AppEnv>) => {
  return c.json(await getSiteData(localeFrom(c)));
};

export const contentController = async (c: Context<AppEnv>) => {
  return c.json(await getContentData(localeFrom(c)));
};
