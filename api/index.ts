import { getRequestListener } from "@hono/node-server";
import type { IncomingMessage, ServerResponse } from "node:http";

import { app } from "../src/app.js";
import { auth } from "../src/lib/auth.js";
import { connectDatabases, isAuthDatabaseConnected, getDatabaseConnectionHelp } from "../src/lib/database.js";

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
 * Handle BetterAuth requests directly, bypassing Hono's body stream handling.
 * This avoids the body-already-consumed issue when getRequestListener
 * converts Node IncomingMessage to Web Request.
 */
async function handleAuthRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    if (!isAuthDatabaseConnected()) {
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        message: "Authentication is unavailable until MongoDB is connected.",
        hint: getDatabaseConnectionHelp(new Error("MongoDB is not connected")),
      }));
      return;
    }

    // Buffer body from Node.js stream
    const bodyBuffer = await readBody(req);

    // Build full URL
    const protocol = "https";
    const host = req.headers.host || "api-abdullahalmaksud.vercel.app";
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
      setTimeout(() => reject(new Error("Auth handler timed out (25s)")), 25000)
    );

    const webResponse = await Promise.race([auth.handler(webRequest), timeoutPromise]);

    // Write status and headers
    const respHeaders: Record<string, string> = {};
    webResponse.headers.forEach((val, key) => {
      respHeaders[key] = val;
    });
    res.writeHead(webResponse.status, respHeaders);

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
      res.end(JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Authentication request failed",
      }));
    }
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Ensure DB is connected before handling the request (cached after first call)
  await connectDatabases().catch((err) => {
    console.error("Database connection error in Vercel handler:", err);
  });

  // Route /api/auth/* directly to BetterAuth, bypassing Hono
  // This avoids body stream issues in Vercel's Node.js runtime
  if (req.url?.startsWith("/api/auth")) {
    return handleAuthRequest(req, res);
  }

  return listener(req, res);
}
