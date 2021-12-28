# ESLint plugin by Profico

This plugin is used to enforce some ESLint rules Profico developers use on a day-to-day basis.

## Installation

Install `eslint-plugin-profico` with npm:

```
npm install --save-dev @profico/eslint-plugin-profico
```

or with yarn:

```
yarn add --dev @profico/eslint-plugin-profico
```

## Usage

To use the recommended rules, add our plugin to your `.eslintrc` file:

```json
{
  "extends": ["plugin:profico/recommended"]
}

// or configure manually:
{
  "plugins": ["profico"],
  "rules": {
    "profico/lodash-imports": ["warn"]
  }
}
```

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

- [ ] Automatically sort import statements according to our style guide:
      https://github.com/profico/react-boilerplate/blob/master/style-guide.md

<br />
      
> Also take a look at our own ESLint config: https://github.com/profico/eslint-config-profico
