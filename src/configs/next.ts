import { Linter } from "eslint";

const next: Linter.Config = {
  extends: ["next/core-web-vitals", require.resolve("./react")],
  rules: {
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
  env: {
    browser: true,
  },
};

export default next;
