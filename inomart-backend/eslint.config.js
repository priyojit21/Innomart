import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "warn",
      semi: ["error", "always"],
      "no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
      camelcase: ["warn", { properties: "always" }],
    },
  },
  pluginJs.configs.recommended,
];