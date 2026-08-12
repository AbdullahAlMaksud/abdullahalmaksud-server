import { getRequestListener } from "@hono/node-server";
import type { IncomingMessage, ServerResponse } from "node:http";

import { app } from "../src/app";
import { connectDatabases } from "../src/lib/database";

// Create a Node.js-compatible request listener from the Hono app.
// Vercel's Node.js runtime passes Node IncomingMessage/ServerResponse objects,
// NOT Web standard Request objects.
const listener = getRequestListener(app.fetch);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Ensure DBs are connected before handling the request in Vercel serverless environment
  await connectDatabases().catch((err) => {
    console.error("Database connection error in Vercel handler:", err);
  });

  return listener(req, res);
}
