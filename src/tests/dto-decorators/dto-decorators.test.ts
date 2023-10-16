import { RuleTester } from "eslint";

import dtoDecorators from "../../rules/dto-decorators";

import invalidCases from "./invalid-cases";
import validCases from "./valid-cases";

const tester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

tester.run("dto-decorators", dtoDecorators, {
  valid: validCases,
  invalid: invalidCases.map<RuleTester.InvalidTestCase>((code, index) => ({
    code,
    output: validCases[index],
    errors: [{ messageId: "improperlyOrderedDecorators" }],
  })),
});
