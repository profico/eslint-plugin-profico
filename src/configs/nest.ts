import { Linter } from "eslint";

const nest: Linter.Config = {
  extends: ["plugin:@profi.co/recommended"],
  rules: {
    "@profi.co/dto-decorators": ["error"],
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
      },
    ],
    "no-useless-constructor": "off",
    "no-empty-function": "off",
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "none",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^[A-Z].*",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*spec.ts"],
      env: {
        jest: true,
      },
    },
  ],
};

export default nest;
