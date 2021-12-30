import { Linter } from "eslint";

const recommended: Linter.Config = {
  plugins: ["@profico"],
  rules: {
    "@profico/lodash-imports": ["error"],
    "@profico/sorted-imports": ["error"],
  },
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
};

export default recommended;
