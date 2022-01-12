# ESLint plugin by Profico

This plugin is used to enforce some ESLint rules Profico developers use on a day-to-day basis.

## Installation

Install `@profi.co/eslint-plugin` with npm:

```
npm install --save-dev @profi.co/eslint-plugin
```

or with yarn:

```
yarn add --dev @profi.co/eslint-plugin
```

## Usage

To use the recommended rules, add our plugin to your `.eslintrc` file:

```json
{
  "extends": ["plugin:@profi.co/recommended"]
}

// or configure manually:
{
  "plugins": ["@profi.co"],
  "rules": {
    "@profi.co/lodash-imports": ["error"],
    "@profi.co/grouped-imports": ["error"],
  }
}
```

The following checklist shows what we have implemented and what we plan on implementing in the near future:

### <a name="lodash-imports">lodash-imports</a>

- [x] Default import lodash modules instead of importing the whole library or parts of it:

```tsx
// Bad
import _ from "lodash"; // Not fixable
import { get, pick } from "lodash"; // Fixable

// Good
import get from "lodash/get";
import pick from "lodash/pick";
```

### <a name="grouped-imports">grouped-imports</a>

- [x] Automatically group import statements according to our style guide:
      https://github.com/profico/react-boilerplate/blob/master/style-guide.md

      TODO:
      - [ ] Include comments as part of import statements
      - [ ] Sort each import group alphabetically

<br />
      
> Also take a look at our own ESLint config: https://github.com/profico/eslint-config-profico
