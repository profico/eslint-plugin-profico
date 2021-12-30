import { Rule } from "eslint";

import { LodashImportsMessages } from "../utils/messages";

const noLodashNamedImports: Rule.RuleModule = {
  meta: {
    fixable: "code",
    type: "problem",
  },
  create: context => ({
    ImportDeclaration: node => {
      const { source, specifiers, loc } = node;

      if (source.value === "lodash") {
        if (specifiers.find(spec => spec.type === "ImportDefaultSpecifier")) {
          context.report({
            node,
            message: LodashImportsMessages.DEFAULT_MESSAGE,
          });
        }

        if (specifiers.find(spec => spec.type === "ImportSpecifier")) {
          context.report({
            node,
            loc: loc || {
              start: { column: 0, line: 0 },
              end: { column: 0, line: 0 },
            },
            message: LodashImportsMessages.DEFAULT_MESSAGE,
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
      }
    },
  }),
};

export default noLodashNamedImports;
