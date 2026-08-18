import { getDatabaseStatus } from "../../lib/database.js";

export const getHealth = () => ({
  status: "ok",
  uptime: process.uptime(),
  database: getDatabaseStatus(),
  timestamp: new Date().toISOString(),
});
