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
    // `import pick from 'lodash/pick';
    // import get from 'lodash/get';
    // import { Paper } from '@components';
    // import DefaultSibling from './DefaultSibling';
    // import { NamedSibling } from './NamedSibling';
    // import styles from './styles.module.scss';`,
    // `import pick from 'lodash/pick';
    // import { Paper } from '@components';`,
  ],
  invalid: [
    {
      code: `import { Paper } from '@components';

      import pick from 'lodash/pick';`,
      errors: [{ message: SortedImportsMessages.NAMED_AFTER_DEFAULT }],
      output: `import pick from 'lodash/pick';

      import { Paper } from '@components';`,
    },
    {
      code: `import { Named } from '../relative';

      import Default from 'default';`,
      errors: [
        { message: SortedImportsMessages.RELATIVE_AFTER_ABSOLUTE },
        { message: SortedImportsMessages.NAMED_AFTER_DEFAULT },
      ],
      output: `import Default from 'default';

      import { Named } from '../relative';`,
    },
    {
      code: `import Default from 'default';
      import { Named } from '../relative';`,
      errors: [
        { message: SortedImportsMessages.LINE_BETWEEN_DEFAULT_AND_NAMED },
      ],
      output: `import Default from 'default';

      import { Named } from '../relative';`,
    },
    // {
    //   code: `import styles from './styles.module.scss';

    //   import { Named } from '../relative';
    //   import Default from 'default';`,
    //   errors: [
    //     { message: SortedImportsMessages.STYLES_AT_END },
    //     { message: SortedImportsMessages.RELATIVE_AFTER_ABSOLUTE },
    //     { message: SortedImportsMessages.NAMED_AFTER_DEFAULT },
    //     { message: SortedImportsMessages.LINE_BETWEEN_DEFAULT_AND_NAMED },
    //   ],
    //   output: `import Default from 'default';

    //   import { Named } from '../relative';

    //   import styles from './styles.module.scss';`,
    // },
  ],
});
