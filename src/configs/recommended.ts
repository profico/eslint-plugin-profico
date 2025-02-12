import { Linter } from "eslint";
import * as tseslint from "@typescript-eslint/eslint-plugin";
import * as tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import { getConfigs, getRules } from "../utils/linter-config";

const recommended = (): Linter.Config => ({
  files: ["**/*.{js,jsx,ts,tsx}"],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaVersion: 2015,
      sourceType: "module",
    },
    globals: {
      NodeJS: "readonly",
    },
  },
  plugins: {
    "@typescript-eslint": tseslint,
    "@profi.co": {
      rules: getRules(),
      configs: getConfigs(),
    },
    import: importPlugin,
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
    },
  },
  rules: {
    ...tseslint.configs.recommended.rules,
    ...prettier.rules,
    ...importPlugin.configs.errors.rules,
    ...importPlugin.configs.warnings.rules,
    ...importPlugin.configs.typescript.rules,

    "@profi.co/lodash-imports": ["error"],
    "@profi.co/grouped-imports": ["error"],
    "@typescript-eslint/ban-ts-comment": ["off"],
    "@typescript-eslint/ban-ts-ignore": ["off"],
    "@typescript-eslint/ban-types": ["off"],
    "@typescript-eslint/camelcase": ["off"],
    "@typescript-eslint/explicit-function-return-type": ["warn"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/interface-name-prefix": ["off"],
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/no-namespace": ["off"],
    "@typescript-eslint/no-redeclare": ["warn"],
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-unused-vars": ["warn"],
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/no-var-requires": ["off"],
    "@typescript-eslint/padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: ["const", "let", "var"],
        next: "*",
      },
      {
        blankLine: "always",
        prev: "*",
        next: ["const", "let", "var"],
      },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },
      {
        blankLine: "always",
        prev: "*",
        next: ["if", "while", "for"],
      },
      {
        blankLine: "always",
        prev: ["if", "while", "for"],
        next: "*",
      },
    ],
    "@typescript-eslint/quotes": ["error", "single", { avoidEscape: true }],
    camelcase: ["off"],
    "class-methods-use-this": ["off"],
    curly: ["error", "all"],
    "global-require": ["off"],
    "import/default": ["error"],
    "import/export": ["error"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/named": ["error"],
    "import/namespace": ["error"],
    "import/no-cycle": ["error", { maxDepth: 1 }],
    "import/no-dynamic-require": ["off"],
    "import/no-unresolved": ["error"],
    "import/order": ["off"],
    "import/prefer-default-export": ["off"],
    "max-params": ["error", 3],
    "newline-before-return": ["error"],
    "no-continue": ["off"],
    "no-param-reassign": [
      "error",
      {
        ignorePropertyModificationsFor: ["acc", "prev"],
      },
    ],
    "no-redeclare": "off",
    "no-restricted-globals": ["off"],
    "no-shadow": ["off"],
    "no-underscore-dangle": ["off"],
    "no-unused-vars": ["off"],
    "no-use-before-define": ["off"],
    "padding-line-between-statements": ["off"],
    quotes: ["off"],
  },
});

export default recommended;
