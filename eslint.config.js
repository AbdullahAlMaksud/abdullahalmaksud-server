import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  // ─── Global ignores ───
  {
    ignores: ["node_modules/", "dist/", "out/", "coverage/", ".vercel/", "*.config.*"],
  },

  // ─── Base JS rules ───
  eslint.configs.recommended,

  // ─── TypeScript rules ───
  ...tseslint.configs.recommended,

  // ─── Project-specific overrides ───
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
    rules: {
      // Relax some strict rules for flexibility
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
  },
);
