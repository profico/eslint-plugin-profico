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
    "@profi.co/dto-decorators": ["error"],
    "@profi.co/ordered-controllers-params": ["error"]
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

- [ ] Include comments as part of import statements
- [ ] Sort each import group alphabetically

### <a name="dto-decorators">dto-decorators</a>

```tsx
// Bad
@IsString()
@ApiProperty()
public classProperty: string;

// Good
@ApiProperty()
@IsString()
public classProperty: string;
```

### <a name="ordered-controller-params">ordered-controller-params</a>

```tsx
// Bad
public findAll(
  @Req() req: VinifyRequest,
  @Query() queryParams: ReadBookmarksQueryParams,
  @Custom2() huehue: Huehue,
  @Custom1() hehe: Hehe,
): Promise<PaginatedResponseDto<ReadBookmarkDto>> {
  return this.readBookmarksService.find(queryParams, req, req.lang);
}

// Good
public findAll(
  @Query() queryParams: ReadBookmarksQueryParams,
  @Req() req: VinifyRequest,
  @Custom1() hehe: Hehe,
  @Custom2() huehue: Huehue,
): Promise<PaginatedResponseDto<ReadBookmarkDto>> {
  return this.readBookmarksService.find(queryParams, req, req.lang);
}
```

<br />
      
> Also take a look at our own ESLint config: https://github.com/profico/eslint-config-profico
