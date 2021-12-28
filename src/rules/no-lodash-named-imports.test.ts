import { RuleTester } from "eslint";

import noLodashNamedImports, { ERROR_MESSAGE } from "./no-lodash-named-imports";

const tester = new RuleTester({
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

tester.run("no-lodash-named-imports", noLodashNamedImports, {
  valid: [
    "import pick from 'lodash/pick';",
    "import pick from 'lodash/pick';\n\"import get from 'lodash/get';\"",
  ],
  invalid: [
    {
      code: "import { pick } from 'lodash';",
      errors: [{ message: ERROR_MESSAGE }],
      output: "import pick from 'lodash/pick';",
    },
    {
      code: "import { pick, get } from 'lodash';",
      errors: [{ message: ERROR_MESSAGE }],
      output: "import pick from 'lodash/pick';\nimport get from 'lodash/get';",
    },
  ],
});
