import { getDatabaseStatus } from "../../lib/database.js";

export const formatUptime = (seconds: number): string => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
};

export const getHealth = () => {
  const uptime = process.uptime();
  return {
    status: "ok",
    uptime: Math.round(uptime * 100) / 100,
    uptimeFormatted: formatUptime(uptime),
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString(),
  };
};
