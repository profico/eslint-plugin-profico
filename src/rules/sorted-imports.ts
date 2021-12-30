import { Rule } from "eslint";
import { ImportDeclaration } from "estree";

import {
  getSourceLocation,
  getImportStatement,
  moveRelativeAfterAbsoluteImports,
  moveNamedAfterDefaultImports,
  insertEmptyLineBetweenNamedAndDefaultImports,
  isStylesImport,
} from "../utils/imports";
import { SortedImportsMessages } from "../utils/messages";

const sortedImports: Rule.RuleModule = {
  meta: {
    fixable: "code",
    type: "problem",
  },
  create: context => ({
    Program: node => {
      const { body } = node;
      const importDeclarations = body.filter(
        value => value.type === "ImportDeclaration",
      ) as ImportDeclaration[];
      let stylesDeclaration: ImportDeclaration | undefined;

      importDeclarations.forEach((currentDeclaration, index) => {
        const prevDeclaration: ImportDeclaration | undefined =
          importDeclarations[index - 1];

        if (!prevDeclaration) {
          return;
        }

        if (isStylesImport(prevDeclaration)) {
          stylesDeclaration = { ...prevDeclaration };
        }

        moveRelativeAfterAbsoluteImports(
          context,
          prevDeclaration,
          currentDeclaration,
        );

        moveNamedAfterDefaultImports(
          context,
          prevDeclaration,
          currentDeclaration,
        );

        insertEmptyLineBetweenNamedAndDefaultImports(
          context,
          prevDeclaration,
          currentDeclaration,
        );
      });

      if (stylesDeclaration) {
        context.report({
          message: SortedImportsMessages.STYLES_AT_END,
          loc: getSourceLocation(stylesDeclaration.loc),
          node: stylesDeclaration,
          fix: fixer => {
            if (!stylesDeclaration) {
              return null;
            }

            const lastImport =
              importDeclarations[importDeclarations.length - 1];

            return [
              fixer.insertTextAfter(
                lastImport,
                `\n\n${getImportStatement(stylesDeclaration)}`,
              ),
              fixer.remove(stylesDeclaration),
            ];
          },
        });
      }
    },
  }),
};

export default sortedImports;
