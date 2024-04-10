import { RuleTester } from "eslint";

import orderedControllerParams from "../../rules/ordered-controller-params";

import invalidCases from "./invalid-cases";
import validCases from "./valid-cases";
import validOnlyCases from "./valid-cases/valid-only-cases";

const tester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

tester.run("ordered-controller-params", orderedControllerParams, {
  valid: validCases,
  invalid: invalidCases.map<RuleTester.InvalidTestCase>((code, index) => ({
    code,
    output: validCases[index],
    errors: [{ messageId: "improperlyOrderedControllerParams" }],
  })),
});

tester.run("ordered-controller-params", orderedControllerParams, {
  valid: validOnlyCases,
  invalid: [],
});
