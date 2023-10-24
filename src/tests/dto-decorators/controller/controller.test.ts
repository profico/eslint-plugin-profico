import path from "path";
import { RuleTester } from "eslint";

import dtoDecorators from "../../../rules/dto-decorators";
import { readFileSync } from "fs";

const tester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const controllerCode = readFileSync(
  path.join(__dirname, "controller.txt"),
).toString();

tester.run("dto-decorators/controller", dtoDecorators, {
  valid: [{ filename: "controller.txt", code: controllerCode }],
  invalid: [],
});
