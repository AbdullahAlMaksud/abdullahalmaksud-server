import { app } from "./app";
import { connectAuthDatabase, connectDatabase, disconnectDatabase } from "./lib/database";
import { env } from "./lib/env";

const startServer = async () => {
  await connectDatabase();
  await connectAuthDatabase();

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
