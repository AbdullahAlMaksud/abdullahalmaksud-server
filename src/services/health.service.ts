import { getDatabaseStatus } from "../lib/database";

export const getHealth = () => ({
  status: "ok",
  uptime: process.uptime(),
  database: getDatabaseStatus(),
  timestamp: new Date().toISOString(),
});
