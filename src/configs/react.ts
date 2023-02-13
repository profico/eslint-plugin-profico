import { Linter } from "eslint";

const react: Linter.Config = {
  env: {
    browser: true,
  },
  extends: ["airbnb", "plugin:@profi.co/recommended"],
  plugins: ["react-hooks"],
  settings: {
    react: {
      version: "detect",
      pragma: "React",
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  globals: {
    NodeJS: "readonly",
    React: "readonly",
    JSX: "readonly",
  },
  rules: {
    "global-require": ["off"],
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        required: {
          some: ["nesting", "id"],
        },
      },
    ],
    "jsx-a11y/mouse-events-have-key-events": ["off"],
    "react-hooks/exhaustive-deps": ["warn"],
    "react-hooks/rules-of-hooks": ["error"],
    "react/function-component-definition": ["off"],
    "react/jsx-curly-newline": ["off"],
    "react/jsx-filename-extension": [
      "warn",
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "react/jsx-no-duplicate-props": ["warn", { ignoreCase: false }],
    "react/jsx-one-expression-per-line": ["off"],
    "react/jsx-props-no-spreading": ["off"],
    "react/jsx-wrap-multilines": ["off"],
    "react/prop-types": ["off"],
    "react/require-default-props": ["off"],
    "react/sort-comp": ["off"],
    "react/state-in-constructor": ["off"],
    "react/static-property-placement": ["off"],
  },
};

export default react;
