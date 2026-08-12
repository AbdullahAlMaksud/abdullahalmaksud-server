import { app } from "./app";
import {
  connectDatabases,
  disconnectDatabase,
  getDatabaseConnectionHelp,
} from "./lib/database";
import { env, requireDatabaseConnection } from "./lib/env";

const startServer = async () => {
  try {
    await connectDatabases();
    console.log("MongoDB connected");
  } catch (error) {
    if (requireDatabaseConnection) {
      throw error;
    }

    console.warn(`MongoDB connection skipped: ${getDatabaseConnectionHelp(error)}`);
  }

  // This file is only run under Bun (local dev). Vercel uses api/index.ts instead.
  // @ts-ignore — Bun global is available at runtime when running under Bun
  const server = Bun.serve({
    hostname: env.HOST,
    port: env.PORT,
    fetch: app.fetch,
  });

  console.log(`Server is running at http://${env.HOST}:${server.port}`);
  console.log(`Better Auth is mounted at ${env.BETTER_AUTH_URL}/api/auth`);
};

const shutdown = async () => {
  await disconnectDatabase();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

