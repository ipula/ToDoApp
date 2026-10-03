import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier/flat";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["**/dist/**", "**/coverage/**"]),

  // Base rules for all files.
  js.configs.recommended,

  // Strict, type-aware TypeScript rules (catch e.g. unawaited promises).
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // Finds the nearest tsconfig.json for each file automatically.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Project-wide rule choices, shared by client and server.
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Enforce `import type` for type-only imports.
      "@typescript-eslint/consistent-type-imports": "error",
      // Allow numbers in template strings, e.g. `at most ${MAX_LENGTH} characters`.
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      // Allow intentionally unused parameters when prefixed with "_",
      // e.g. `_req`, or `_next` in Express error handlers (which need 4 params).
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  // Server: Node.js environment.
  {
    files: ["server/**/*.ts"],
    languageOptions: { globals: globals.node },
  },

  // Client: browser environment + React rules.
  {
    files: ["client/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat["recommended-latest"], reactRefresh.configs.vite],
    languageOptions: { globals: globals.browser },
  },

  // Must be last: turns off rules that would conflict with Prettier's formatting.
  prettier,
);