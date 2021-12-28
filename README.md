# ESLint plugin by Profico

This plugin is used to enforce some ESLint rules Profico developers use on a day-to-day basis.
The following checklist shows what we have implemented and what we plan on implementing in the near future:

- [x] Default import lodash modules instead of importing the whole library or parts of it:

```tsx
// Bad
import _ from "lodash"; // Not fixable
import { get, pick } from "lodash"; // Fixable

// Good
import get from "lodash/get";
import pick from "lodash/pick";
```

- [ ] Automatically sort import statements according to our style guide
  > https://github.com/profico/react-boilerplate/blob/master/style-guide.md
