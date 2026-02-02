import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import { rules } from "eslint-plugin-tsdoc";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/dot-notation": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-useless-constructor": "warn",
      "@typescript-eslint/no-useless-default-assignment": "warn",
      "@typescript-eslint/no-useless-empty-export": "warn",
      "no-undef": "error",
      "eqeqeq": "error",
      "no-duplicate-imports": "error",
      "prefer-const": "error",

      //Stylistic rules
      "quotes": ["error", "single", { "avoidEscape": true }],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "space-infix-ops": "error",
      "keyword-spacing": ["error", { "before": true, "after": true }],
      "camelcase": "warn",
  }, 
  extends: ["js/recommended"], 
  languageOptions: 
  { globals: globals.browser } },
  tseslint.configs.recommended,
]);


