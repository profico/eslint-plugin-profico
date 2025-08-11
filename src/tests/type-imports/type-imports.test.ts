import { RuleTester } from "eslint";

import typeImports from "../../rules/type-imports";

import invalidCases from "./invalid-cases";
import validCases from "./valid-cases";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
    parserOptions: {
      sourceType: "module",
      ecmaVersion: 2015,
    },
  },
});

tester.run("profico/type-imports", typeImports, {
  valid: validCases,
  invalid: invalidCases.map<RuleTester.InvalidTestCase>((code, index) => ({
    code,
    output: validCases[index],
    errors: [
      { messageId: "mixedTypeValueImports" },
      { messageId: "mixedTypeValueImports" },
    ],
  })),
});
