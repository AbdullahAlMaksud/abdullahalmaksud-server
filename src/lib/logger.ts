/**
 * Pretty console logger with ANSI colors for server startup and runtime messages.
 * No external dependencies — uses Node.js built-in ANSI escape codes.
 */

// ANSI color codes
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",

  // Foreground
  green: "\x1b[32m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
  gray: "\x1b[90m",

  // Bright variants
  greenBright: "\x1b[92m",
  blueBright: "\x1b[94m",
  cyanBright: "\x1b[96m",
  yellowBright: "\x1b[93m",
  magentaBright: "\x1b[95m",

  // Background
  bgGreen: "\x1b[42m",
  bgBlue: "\x1b[44m",
  bgCyan: "\x1b[46m",
  bgYellow: "\x1b[43m",
  bgRed: "\x1b[41m",
  bgMagenta: "\x1b[45m",
} as const;

const timestamp = () => {
  const now = new Date();
  return `${c.gray}${now.toLocaleTimeString("en-US", { hour12: false })}${c.reset}`;
};

const badge = (label: string, bg: string, fg: string = c.bold + c.white) =>
  `${bg}${fg} ${label} ${c.reset}`;

export const log = {
  /** ──── Server lifecycle ──── */
  serverStart: (host: string, port: number) => {
    const url = `http://${host === "0.0.0.0" ? "localhost" : host}:${port}`;
    console.log("");
    console.log(`  ${badge("SERVER", c.bgGreen)} ${c.greenBright}${c.bold}Abdullah Al Maksud API${c.reset}`);
    console.log("");
    console.log(`  ${c.green}➜${c.reset}  ${c.bold}Local:${c.reset}   ${c.cyanBright}${url}${c.reset}`);
    console.log(`  ${c.green}➜${c.reset}  ${c.bold}Network:${c.reset} ${c.cyanBright}http://${host}:${port}${c.reset}`);
    console.log("");
  },

  authMounted: (url: string) => {
    console.log(`  ${c.blue}➜${c.reset}  ${c.bold}Auth:${c.reset}    ${c.cyanBright}${url}/api/auth${c.reset}`);
  },

  /** ──── Database ──── */
  dbConnected: (dbName?: string) => {
    const label = dbName ? ` (${dbName})` : "";
    console.log(`  ${c.green}✓${c.reset} ${c.greenBright}MongoDB connected${c.reset}${c.dim}${label}${c.reset}`);
  },

  dbSkipped: (reason: string) => {
    console.log(`  ${c.yellow}⚠${c.reset} ${c.yellowBright}MongoDB skipped${c.reset} ${c.dim}— ${reason}${c.reset}`);
  },

  /** ──── Seeding ──── */
  seedStart: (collection: string) => {
    console.log(`  ${c.blue}◆${c.reset} ${c.blueBright}Seeding${c.reset} ${c.cyan}${collection}${c.reset}${c.dim}...${c.reset}`);
  },

  seedDone: (collection: string) => {
    console.log(`  ${c.green}✓${c.reset} ${c.greenBright}Seeded${c.reset}  ${c.cyan}${collection}${c.reset}`);
  },

  seedError: (error: unknown) => {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`  ${c.red}✗${c.reset} ${c.red}Seeding error:${c.reset} ${msg}`);
  },

  /** ──── General ──── */
  info: (message: string) => {
    console.log(`${timestamp()} ${c.blueBright}ℹ${c.reset} ${message}`);
  },

  success: (message: string) => {
    console.log(`${timestamp()} ${c.green}✓${c.reset} ${c.greenBright}${message}${c.reset}`);
  },

  warn: (message: string) => {
    console.warn(`${timestamp()} ${c.yellow}⚠${c.reset} ${c.yellowBright}${message}${c.reset}`);
  },

  error: (message: string, error?: unknown) => {
    const detail = error instanceof Error ? `: ${error.message}` : error ? `: ${error}` : "";
    console.error(`${timestamp()} ${c.red}✗${c.reset} ${c.red}${message}${detail}${c.reset}`);
  },

  /** ──── Startup banner (called once) ──── */
  banner: (env: string) => {
    const modeColor = env === "production" ? c.red : env === "development" ? c.green : c.yellow;
    const modeLabel = env.toUpperCase();
    console.log("");
    console.log(`  ${c.dim}───────────────────────────────────────${c.reset}`);
    console.log(`  ${c.bold}${c.cyanBright}  abdullahalmaksud${c.reset} ${c.dim}// Server${c.reset}`);
    console.log(`  ${c.dim}  Mode:${c.reset} ${modeColor}${c.bold}${modeLabel}${c.reset}`);
    console.log(`  ${c.dim}───────────────────────────────────────${c.reset}`);
    console.log("");
  },
};
