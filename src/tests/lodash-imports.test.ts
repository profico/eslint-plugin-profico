import { RuleTester } from "eslint";

import lodashImports from "../rules/lodash-imports";

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
      errors: [{ messageId: "invalidImport" }],
      output: "import pick from 'lodash/pick';",
    },
    {
      code: "import { get, pick } from 'lodash';",
      errors: [{ messageId: "invalidImport" }],
      output: "import get from 'lodash/get';\nimport pick from 'lodash/pick';",
    },
    {
      code: "import _ from 'lodash';",
      errors: [{ messageId: "noUnderscoreImport" }],
    },
    {
      code: "import lodash from 'lodash';",
      errors: [{ messageId: "noUnderscoreImport" }],
    },
    {
      code: "import * as _ from 'lodash';",
      errors: [{ messageId: "noUnderscoreImport" }],
    },
    {
      code: "import * as lodash from 'lodash';",
      errors: [{ messageId: "noUnderscoreImport" }],
    },
    {
      code: "import _, { get, pick } from 'lodash';",
      errors: [
        { messageId: "noUnderscoreImport" },
        { messageId: "invalidImport" },
      ],
      output:
        "import _ from 'lodash';\nimport get from 'lodash/get';\nimport pick from 'lodash/pick';",
    },
  ],
});
