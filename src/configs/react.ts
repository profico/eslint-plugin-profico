import { Linter } from "eslint";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import recommended from "./recommended";

const react: Linter.Config = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  ...recommended(),
  languageOptions: {
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
      browser: true,
    },
  },
  plugins: {
    "react-hooks": reactHooksPlugin,
  },
  settings: {
    react: {
      version: "detect",
      pragma: "React",
    },
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
