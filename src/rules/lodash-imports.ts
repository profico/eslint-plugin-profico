import { Rule } from "eslint";

import {
  hasNamedImports,
  isDefaultImport,
  isNamespaceImport,
} from "../utils/imports";

const lodashImports: Rule.RuleModule = {
  meta: {
    fixable: "code",
    type: "problem",
    messages: {
      invalidImport:
        "Use default imports from lodash modules to reduce the bundle size. E.g. `import pick from 'lodash/pick';`",
      noUnderscoreImport:
        "Don't import the full `lodash` package. Import separate modules to reduce the bundle size.",
    },
    docs: {
      url: "https://github.com/profico/eslint-plugin-profico#lodash-imports",
    },
  },
  create: context => ({
    ImportDeclaration: node => {
      const { source, specifiers, loc } = node;

      if (source.value !== "lodash") {
        return null;
      }

      if (isNamespaceImport(node) || isDefaultImport(node)) {
        context.report({
          node,
          messageId: "noUnderscoreImport",
        });
      }

      if (hasNamedImports(node)) {
        context.report({
          node,
          loc: loc || {
            start: { column: 0, line: 0 },
            end: { column: 0, line: 0 },
          },
          messageId: "invalidImport",
          fix: fixer =>
            fixer.replaceText(
              node,
              specifiers
                .map(spec =>
                  spec.type === "ImportSpecifier"
                    ? `import ${spec.local.name} from 'lodash/${spec.local.name}';`
                    : `import ${spec.local.name} from 'lodash';`,
                )
                .join("\n"),
            ),
        });
      }
    },
  }),
};

export default lodashImports;
