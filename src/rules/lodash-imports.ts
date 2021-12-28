import { Rule } from "eslint";

export const ERROR_MESSAGE =
  "Use default imports from lodash modules to reduce the bundle size. E.g. `import pick from 'lodash/pick';`";

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
            message: ERROR_MESSAGE,
          });
        }

        if (specifiers.find(spec => spec.type === "ImportSpecifier")) {
          context.report({
            node,
            loc: loc || {
              start: { column: 0, line: 0 },
              end: { column: 0, line: 0 },
            },
            message: ERROR_MESSAGE,
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
