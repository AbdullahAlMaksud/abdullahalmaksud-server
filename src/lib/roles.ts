import { adminEmails } from "./env";

export const appRoles = ["admin", "user"] as const;

export type AppRole = (typeof appRoles)[number];

export const defaultRole: AppRole = "user";
export const adminRole: AppRole = "admin";

export const resolveRoleForEmail = (email?: string | null): AppRole => {
  if (email && adminEmails.has(email.toLowerCase())) {
    return adminRole;
  }

  return defaultRole;
};

export const isAdminRole = (role?: string | null) => role === adminRole;
