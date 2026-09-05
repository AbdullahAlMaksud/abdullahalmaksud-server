import { serve } from "@hono/node-server";

import { app } from "./app.js";
import {
  connectDatabases,
  disconnectDatabase,
  getDatabaseConnectionHelp,
} from "./lib/database.js";
import { env, requireDatabaseConnection } from "./lib/env.js";
import { log } from "./lib/logger.js";

const startServer = async () => {
  log.banner(env.NODE_ENV);

  try {
    await connectDatabases();
    log.dbConnected(env.MONGODB_DB_NAME);
  } catch (error) {
    if (requireDatabaseConnection) {
      throw error;
    }

    log.dbSkipped(getDatabaseConnectionHelp(error));
  }

  // Local dev server (tsx/Node.js). Vercel uses api/index.ts instead.
  const server = serve({
    fetch: app.fetch,
    hostname: env.HOST,
    port: env.PORT,
  });

  log.serverStart(env.HOST, env.PORT);
  log.authMounted(env.BETTER_AUTH_URL);
  console.log("");
};

const shutdown = async () => {
  await disconnectDatabase();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer().catch((error) => {
  log.error("Failed to start server", error);
  process.exit(1);
});
