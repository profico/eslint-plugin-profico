import { Linter } from "eslint";
import recommended from "./recommended";
import nextConfig from "eslint-config-next";

const next: Linter.Config = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  ...recommended(),
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    globals: {
      browser: true,
    },
  },
  rules: {
    ...nextConfig,
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.{test,spec}.{ts,tsx,js,jsx}",
          "next.config.{js,ts}",
        ],
      },
    ],
  },
};

export default next;
