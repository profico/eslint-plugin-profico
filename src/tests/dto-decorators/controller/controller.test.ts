import path from "path";
import { RuleTester } from "eslint";

import { readFileSync } from "fs";
import dtoDecorators from "../../../rules/dto-decorators";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

const controllerCode = readFileSync(
  path.join(__dirname, "controller.txt"),
).toString();

tester.run("dto-decorators", dtoDecorators, {
  valid: [
    { filename: "controller.txt", code: controllerCode, name: "controller" },
  ],
  invalid: [],
});
