import { RuleTester } from "eslint";

import noLodashDefaultImport, { ERROR_MESSAGE } from "./no-lodash-default-import";

const tester = new RuleTester({
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

tester.run("no-lodash-default-import", noLodashDefaultImport, {
  valid: ["import something from 'lodash/something';"],
  invalid: [
    {
      code: "import _ from 'lodash';",
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: "import _, { get, pick } from 'lodash';",
      errors: [{ message: ERROR_MESSAGE }],
    },
  ],
});
