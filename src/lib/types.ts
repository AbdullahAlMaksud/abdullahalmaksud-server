import type { auth } from "./auth.js";
import type { AppRole } from "./roles.js";

export type AppUser = typeof auth.$Infer.Session.user & {
  role?: AppRole | string | null;
};

export type AppVariables = {
  user: AppUser | null;
  session: typeof auth.$Infer.Session.session | null;
};

export type AppEnv = {
  Variables: AppVariables;
};
