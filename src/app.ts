import { Hono } from "hono";
import { cors } from "hono/cors";

import { healthController } from "./modules/health/health.controller.js";
import { formatUptime } from "./modules/health/health.service.js";
import { getDatabaseStatus } from "./lib/database.js";
import { isAllowedOrigin } from "./lib/env.js";
import type { AppEnv } from "./lib/types.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { sessionMiddleware } from "./middlewares/session.middleware.js";
import { routes } from "./modules/index.js";

import { renderRootHtml } from "./lib/status-page.js";

export const app = new Hono<AppEnv>();

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) {
        return null;
      }

      return isAllowedOrigin(origin) ? origin : null;
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "set-auth-token"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", async (c, next) => {
  // Skip session middleware for auth routes — BetterAuth's auth.handler()
  // needs to consume the raw request body/stream itself. If sessionMiddleware
  // (which calls auth.api.getSession()) runs first, the body stream gets
  // consumed/locked, causing auth.handler() to hang indefinitely (504 on Vercel).
  if (c.req.path.startsWith("/api/auth")) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  return sessionMiddleware(c, next);
});

app.get("/favicon.ico", (c) => c.body(null, 204));
app.get("/public/favicon.svg", (c) => c.body(null, 204));

app.get("/", (c) => {
  const format = c.req.query("format");
  const acceptHeader = c.req.header("accept") || "";

  const uptime = process.uptime();
  const dbStatus = getDatabaseStatus();
  const isDbConnected = dbStatus.state === "connected";
  const status = "running";
  const health = isDbConnected ? "healthy" : "degraded";
  const uptimeFormatted = formatUptime(uptime);
  const timestamp = new Date().toISOString();

  if (
    format === "json" ||
    (acceptHeader.includes("application/json") && !acceptHeader.includes("text/html"))
  ) {
    return c.json({
      success: true,
      status,
      health,
      uptime: Math.round(uptime * 100) / 100,
      uptimeFormatted,
      database: dbStatus.state,
      timestamp,
    });
  }

  return c.html(
    renderRootHtml({
      status,
      health,
      uptime,
      uptimeFormatted,
      database: dbStatus.state,
      timestamp,
    }),
  );
});

app.get("/health", healthController);
app.route("/api", routes);

app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
export type AppType = typeof app;
