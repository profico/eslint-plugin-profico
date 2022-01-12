import { Linter } from "eslint";

const recommended: Linter.Config = {
  plugins: ["@profi.co"],
  rules: {
    "@profi.co/lodash-imports": ["error"],
    "@profi.co/grouped-imports": ["error"],
  },
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
};

export default recommended;
