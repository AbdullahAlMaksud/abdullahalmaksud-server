import type { Context } from "hono";

import { isAuthDatabaseConnected } from "../../lib/database.js";
import type { AppEnv } from "../../lib/types.js";
import { getDefaultSiteLocale } from "./site.defaults.js";
import { SiteLocaleModel, type SupportedLocale } from "./site.model.js";

const parseLocale = (raw?: string | null): SupportedLocale => {
  return raw === "bn" ? "bn" : "en";
};

const ensureSiteLocale = async (locale: SupportedLocale) => {
  const defaults = getDefaultSiteLocale(locale);
  let doc = await SiteLocaleModel.findOne({ locale });
  if (!doc) {
    doc = await SiteLocaleModel.findOneAndUpdate(
      { locale },
      { $setOnInsert: defaults },
      { upsert: true, returnDocument: "after" },
    );
  }
  const raw = doc.toJSON();
  return {
    ...defaults,
    ...raw,
    meta: { ...defaults.meta, ...(raw.meta || {}) },
    nav: { ...defaults.nav, ...(raw.nav || {}) },
    identity: { ...defaults.identity, ...(raw.identity || {}) },
    sections: { ...defaults.sections, ...(raw.sections || {}) },
    advisory: { ...defaults.advisory, ...(raw.advisory || {}) },
    contact: { ...defaults.contact, ...(raw.contact || {}) },
    footer: { ...defaults.footer, ...(raw.footer || {}) },
    ui: { ...defaults.ui, ...(raw.ui || {}) },
    metrics: Array.isArray(raw.metrics) && raw.metrics.length > 0 ? raw.metrics : defaults.metrics,
    marqueeItems:
      Array.isArray(raw.marqueeItems) && raw.marqueeItems.length > 0
        ? raw.marqueeItems
        : defaults.marqueeItems,
  };
};

export const getSiteData = async (c: Context<AppEnv>) => {
  if (!isAuthDatabaseConnected()) {
    return c.json(
      {
        success: false,
        message: "Database is disconnected.",
      },
      503,
    );
  }

  try {
    const locale = parseLocale(c.req.query("locale"));
    const doc = await ensureSiteLocale(locale);

    return c.json({
      success: true,
      data: doc,
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const getAllSiteLocales = async (c: Context<AppEnv>) => {
  if (!isAuthDatabaseConnected()) {
    return c.json({ success: false, message: "Database is disconnected." }, 503);
  }

  try {
    const [en, bn] = await Promise.all([ensureSiteLocale("en"), ensureSiteLocale("bn")]);
    return c.json({
      success: true,
      data: { en, bn },
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateSiteData = async (c: Context<AppEnv>) => {
  if (!isAuthDatabaseConnected()) {
    return c.json({ success: false, message: "Database is disconnected." }, 503);
  }

  try {
    const locale = parseLocale(c.req.query("locale") || c.req.param("locale"));
    const body = (await c.req.json()) as Record<string, unknown>;

    // Strip immutable/meta fields before updating
    const { id: _id, _id: _mongoId, __v: _v, createdAt: _c, updatedAt: _u, ...rest } = body;

    const updated = await SiteLocaleModel.findOneAndUpdate(
      { locale },
      { $set: { ...rest, locale } },
      { returnDocument: "after", upsert: true, runValidators: true },
    );

    return c.json({
      success: true,
      message: `Site configuration (${locale}) updated successfully`,
      data: updated,
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 400);
  }
};

export const resetSiteData = async (c: Context<AppEnv>) => {
  if (!isAuthDatabaseConnected()) {
    return c.json({ success: false, message: "Database is disconnected." }, 503);
  }

  try {
    const localeParam = c.req.query("locale");
    if (localeParam === "all") {
      const [en, bn] = await Promise.all([
        SiteLocaleModel.findOneAndUpdate(
          { locale: "en" },
          { $set: getDefaultSiteLocale("en") },
          { returnDocument: "after", upsert: true },
        ),
        SiteLocaleModel.findOneAndUpdate(
          { locale: "bn" },
          { $set: getDefaultSiteLocale("bn") },
          { returnDocument: "after", upsert: true },
        ),
      ]);
      return c.json({ success: true, data: { en, bn } });
    }

    const locale = parseLocale(localeParam);
    const updated = await SiteLocaleModel.findOneAndUpdate(
      { locale },
      { $set: getDefaultSiteLocale(locale) },
      { returnDocument: "after", upsert: true },
    );

    return c.json({
      success: true,
      message: `Site configuration (${locale}) reset to defaults`,
      data: updated,
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
