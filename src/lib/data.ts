const locales = ["en", "bn"] as const;

export type Locale = (typeof locales)[number];

type DataGroup = "site" | "content" | "dashboard";

type AppData = Record<DataGroup, unknown>;

const cache = new Map<Locale, Promise<AppData>>();

export const toLocale = (value?: string | null): Locale => {
  return locales.includes(value as Locale) ? (value as Locale) : "en";
};

async function readJson(locale: Locale, group: DataGroup) {
  return Bun.file(new URL(`../data/${locale}/${group}.json`, import.meta.url)).json();
}

export function getAppData(locale: Locale) {
  if (!cache.has(locale)) {
    cache.set(
      locale,
      Promise.all([
        readJson(locale, "site"),
        readJson(locale, "content"),
        readJson(locale, "dashboard"),
      ]).then(([site, content, dashboard]) => ({ site, content, dashboard })),
    );
  }

  return cache.get(locale)!;
}

export async function getSiteData(locale: Locale) {
  return (await getAppData(locale)).site;
}

export async function getContentData(locale: Locale) {
  return (await getAppData(locale)).content as {
    projects: { slug: string }[];
    blogPosts: { slug: string }[];
    books: { id: string }[];
  };
}

export async function getDashboardData(locale: Locale) {
  return (await getAppData(locale)).dashboard;
}
