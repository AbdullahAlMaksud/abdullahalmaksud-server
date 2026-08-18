import type { Context } from "hono";

import { getDashboardData, toLocale } from "../../lib/data.js";
import type { AppEnv } from "../../lib/types.js";

const localeFrom = (c: Context<AppEnv>) => toLocale(c.req.query("locale"));

export const getDashboard = async (c: Context<AppEnv>) => {
  return c.json(await getDashboardData(localeFrom(c)));
};

export const getMessages = async (c: Context<AppEnv>) => {
  const dashboard = (await getDashboardData(localeFrom(c))) as {
    messages: unknown[];
  };
  return c.json(dashboard.messages);
};

export const getNotifications = async (c: Context<AppEnv>) => {
  const dashboard = (await getDashboardData(localeFrom(c))) as {
    notifications: unknown[];
  };
  return c.json(dashboard.notifications);
};
