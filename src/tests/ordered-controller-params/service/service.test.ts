import path from "path";
import { RuleTester } from "eslint";

import dtoDecorators from "../../../rules/dto-decorators";
import { readFileSync } from "fs";

const tester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const serviceCode = readFileSync(
  path.join(__dirname, "service.txt"),
).toString();

tester.run("ordered-controller-params", dtoDecorators, {
  valid: [{ filename: "service.txt", code: serviceCode, name: "service" }],
  invalid: [],
});
