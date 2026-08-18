import { getRequestListener } from "@hono/node-server";
import type { IncomingMessage, ServerResponse } from "node:http";

import { app } from "../src/app.js";
import { connectDatabases } from "../src/lib/database.js";

// Create a Node.js-compatible request listener from the Hono app.
// Vercel's Node.js runtime passes Node IncomingMessage/ServerResponse objects,
// NOT Web standard Request objects. The `hono/vercel` handle() adapter assumes
// Edge Runtime (Web Request), which causes `headers.get is not a function` errors.
// Using @hono/node-server's getRequestListener properly converts between the two.
const listener = getRequestListener(app.fetch);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Ensure DB is connected before handling the request (cached after first call)
  await connectDatabases().catch((err) => {
    console.error("Database connection error in Vercel handler:", err);
  });
  return listener(req, res);
}

