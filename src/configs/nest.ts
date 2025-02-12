import { Linter } from "eslint";
import recommended from "./recommended";

const nestConfig: Linter.Config = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  ...recommended(),
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  rules: {
    "@profi.co/dto-decorators": ["error"],
    "@profi.co/ordered-controller-params": ["error"],
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: false }],
    "no-useless-constructor": "off",
    "no-empty-function": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};

export default nestConfig;
