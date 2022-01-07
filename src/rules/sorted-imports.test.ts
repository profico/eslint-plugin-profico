import { RuleTester } from "eslint";

import sortedImports from "./sorted-imports";

const tester = new RuleTester({
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

tester.run("sorted-imports", sortedImports, {
  valid: [],
  invalid: [
    {
      code: "import { Paper } from '@components';\nimport pick from 'lodash/pick';",
      errors: [{ messageId: "improperlySorted" }],
      output:
        "import pick from 'lodash/pick';\n\nimport { Paper } from '@components';\n",
    },
    {
      code: "import { Paper } from '@components';\nimport pick from 'lodash/pick';\nimport 'styles.css';",
      errors: [{ messageId: "improperlySorted" }],
      output:
        "import 'styles.css';\n\nimport pick from 'lodash/pick';\n\nimport { Paper } from '@components';\n",
    },
  ],
});
