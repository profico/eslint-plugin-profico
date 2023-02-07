import { Linter } from "eslint";

const recommended: Linter.Config = {
  plugins: ["@profi.co"],
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  globals: {
    NodeJS: "readonly",
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
    "@profi.co/lodash-imports": ["error"],
    "@profi.co/grouped-imports": ["error"],
    "@typescript-eslint/ban-ts-comment": ["off"],
    "@typescript-eslint/ban-ts-ignore": ["off"],
    "@typescript-eslint/camelcase": ["off"],
    "@typescript-eslint/explicit-function-return-type": ["warn"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/interface-name-prefix": ["off"],
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-unused-vars": ["warn"],
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/no-var-requires": ["off"],
    camelcase: ["off"],
    "class-methods-use-this": ["off"],
    curly: ["error"],
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
    "import/prefer-default-export": ["off"],
    "newline-before-return": ["error"],
    "no-shadow": ["off"],
    "no-unused-vars": ["off"],
    "no-use-before-define": ["off"],
    "padding-line-between-statements": [
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
  },
};

export default recommended;
