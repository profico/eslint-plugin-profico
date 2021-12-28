import { RuleTester } from "eslint";

import lodashImports, { ERROR_MESSAGE } from "./lodash-imports";

const tester = new RuleTester({
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

tester.run("lodash-imports", lodashImports, {
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
      code: "import { get, pick } from 'lodash';",
      errors: [{ message: ERROR_MESSAGE }],
      output: "import get from 'lodash/get';\nimport pick from 'lodash/pick';",
    },
    {
      code: "import _ from 'lodash';",
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: "import _, { get, pick } from 'lodash';",
      errors: [{ message: ERROR_MESSAGE }, { message: ERROR_MESSAGE }],
      output:
        "import _ from 'lodash';\nimport get from 'lodash/get';\nimport pick from 'lodash/pick';",
    },
  ],
});
