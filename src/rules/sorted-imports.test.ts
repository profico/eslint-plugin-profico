import { RuleTester } from "eslint";

import sortedImports from "./sorted-imports";

import { SortedImportsMessages } from "../utils/messages";

const tester = new RuleTester({
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

tester.run("sorted-imports", sortedImports, {
  valid: [
    `import pick from 'lodash/pick';
    import get from 'lodash/get';

    import { Paper } from '@components';

    import DefaultSibling from './DefaultSibling';

    import { NamedSibling } from './NamedSibling';

    import styles from './styles.module.scss';`,
    `import pick from 'lodash/pick';
    
    import { Paper } from '@components';`,
  ],
  invalid: [
    {
      code: `import { Paper } from '@components';
      
      import pick from 'lodash/pick';`,
      errors: [{ message: SortedImportsMessages.RELATIVE_AFTER_ABSOLUTE }],
      output: `import pick from 'lodash/pick';
      
      import { Paper } from '@components';`,
    },
  ],
});
