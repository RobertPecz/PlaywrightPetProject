import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  // --------------------
  // JS files (NO type info)
  // --------------------
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser
    },
    extends: [js.configs.recommended]
  },

  // --------------------
  // TS files (WITH type info)
  // --------------------
  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname
      },
      globals: globals.browser
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/no-useless-default-assignment': 'warn',
      '@typescript-eslint/no-useless-empty-export': 'warn',

      'eqeqeq': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',

      // stylistic
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-infix-ops': 'error',
      'keyword-spacing': ['error', { before: true, after: true }],
      'camelcase': 'warn'
    }
  },

  // --------------------
  // Ignore config files
  // --------------------
  {
    ignores: ['eslint.config.mts']
  }
]);
