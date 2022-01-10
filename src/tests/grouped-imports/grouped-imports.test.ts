import { RuleTester } from "eslint";

import groupedImports from "../../rules/grouped-imports";

import invalidCases from "./invalid-cases";
import validCases from "./valid-cases";

const tester = new RuleTester({
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

tester.run("grouped-imports", groupedImports, {
  valid: validCases,
  invalid: invalidCases.map<RuleTester.InvalidTestCase>((code, index) => ({
    code,
    output: validCases[index],
    errors: [{ messageId: "improperlyGrouped" }],
  })),
});
