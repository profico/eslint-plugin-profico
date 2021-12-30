export const LodashImportsMessages = {
  DEFAULT_MESSAGE:
    "Use default imports from lodash modules to reduce the bundle size. E.g. `import pick from 'lodash/pick';`",
} as const;

export const SortedImportsMessages = {
  RELATIVE_AFTER_ABSOLUTE:
    "Relative imports should be listed after absolute imports.",
  NAMED_AFTER_DEFAULT: "Named imports should be listed after default imports.",
  STYLES_AT_END:
    "Styles imports should be listed at the end of import statements.",
  LINE_BETWEEN_DEFAULT_AND_NAMED:
    "There should be an empty line between default and named imports",
} as const;
