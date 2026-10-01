import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier/flat";
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

  // Server: Node.js environment.
  {
    files: ["server/**/*.ts"],
    languageOptions: { globals: globals.node },
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

  // Must be last: turns off rules that would conflict with Prettier's formatting.
  prettier,
);
