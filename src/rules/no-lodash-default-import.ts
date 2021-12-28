import { Rule } from "eslint";

export const ERROR_MESSAGE =
  "Don't default import the whole lodash library since it will seriously affect the bundle size. Instead, default import lodash modules. E.g. `import pick from 'lodash/pick';`";

const noLodashDefaultImport: Rule.RuleModule = {
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
      }
    },
  }),
};

export default noLodashDefaultImport;
