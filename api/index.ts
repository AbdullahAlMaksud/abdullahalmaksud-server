import { getRequestListener } from "@hono/node-server";
import type { IncomingMessage, ServerResponse } from "node:http";

import { app } from "../src/app.js";
import { getAuth } from "../src/lib/auth.js";
import {
  connectDatabases,
  isAuthDatabaseConnected,
  getDatabaseConnectionHelp,
  getLastDatabaseError,
} from "../src/lib/database.js";
import { isAllowedOrigin } from "../src/lib/env.js";

// Create a Node.js-compatible request listener from the Hono app.
// Vercel's Node.js runtime passes Node IncomingMessage/ServerResponse objects.
const listener = getRequestListener(app.fetch);

/**
 * Buffer the raw body from an IncomingMessage into a Buffer.
 */
function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/**
 * Set CORS headers on the Node ServerResponse if the request Origin is allowed.
 */
function applyCorsHeaders(req: IncomingMessage, res: ServerResponse): boolean {
  const origin = req.headers.origin;
  if (!origin) return false;

  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      (req.headers["access-control-request-headers"] as string) ||
        "Content-Type, Authorization, X-Requested-With, Cookie",
    );
    res.setHeader("Access-Control-Expose-Headers", "Content-Length, set-auth-token");
    res.setHeader("Vary", "Origin");
    return true;
  }
  return false;
}

/**
 * Handle BetterAuth requests directly, bypassing Hono's body stream handling.
 * This avoids the body-already-consumed issue when getRequestListener
 * converts Node IncomingMessage to Web Request.
 */
async function handleAuthRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // Always attach CORS headers so preflight, successes, and errors allow browser access
  applyCorsHeaders(req, res);

  // Handle CORS preflight (OPTIONS) immediately without waiting for DB connection
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "600");
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (!isAuthDatabaseConnected()) {
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Authentication is unavailable until MongoDB is connected.",
          hint: getDatabaseConnectionHelp(
            getLastDatabaseError() ?? new Error("MongoDB is not connected"),
          ),
        }),
      );
      return;
    }

    // Buffer body from Node.js stream
    const bodyBuffer = await readBody(req);

    // Build full URL
    const protocol = "https";
    const host = req.headers.host || "api.abdullahalmaksud.com";
    const url = `${protocol}://${host}${req.url}`;

    // Build clean Web Request headers
    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val === undefined) continue;
      if (Array.isArray(val)) {
        val.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, val);
      }
    }

    // Build Web Request with buffered body
    const hasBody = ["POST", "PUT", "PATCH"].includes(req.method ?? "");
    const webRequest = new Request(url, {
      method: req.method ?? "GET",
      headers,
      body: hasBody && bodyBuffer.length > 0 ? new Uint8Array(bodyBuffer) : undefined,
    });

    // Timeout guard: prevent hanging beyond 25s
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Auth handler timed out (25s)")), 25000),
    );

    const webResponse = await Promise.race([getAuth().handler(webRequest), timeoutPromise]);

    // Copy webResponse headers (excluding set-cookie and access-control headers which we manage)
    webResponse.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      if (lower !== "set-cookie" && !lower.startsWith("access-control-")) {
        res.setHeader(key, val);
      }
    });

    // Handle Set-Cookie headers properly (support multiple cookies from BetterAuth)
    const getSetCookieFn = (webResponse.headers as any).getSetCookie;
    const cookies: string[] =
      typeof getSetCookieFn === "function" ? getSetCookieFn.call(webResponse.headers) : [];

    if (cookies.length > 0) {
      res.setHeader("Set-Cookie", cookies);
    } else {
      const singleCookie = webResponse.headers.get("set-cookie");
      if (singleCookie) {
        res.setHeader("Set-Cookie", singleCookie);
      }
    }

    res.writeHead(webResponse.status);

    // Stream body
    if (webResponse.body) {
      const reader = webResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    console.error("[AUTH] Direct handler error:", error);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: error instanceof Error ? error.message : "Authentication request failed",
        }),
      );
    }
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Ensure DB is connected before handling the request (cached after first call)
  await connectDatabases().catch((err) => {
    console.error("Database connection error in Vercel handler:", err);
  });

  if (req.url?.startsWith("/api/auth")) {
    return handleAuthRequest(req, res);
  }

  return listener(req, res);
}
