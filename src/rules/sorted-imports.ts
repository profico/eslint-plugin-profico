import { Rule } from "eslint";
import { ImportDeclaration } from "estree";

import {
  getSourceLocation,
  getImportStatement,
  moveRelativeAfterAbsoluteImports,
  moveNamedAfterDefaultImports,
  insertEmptyLineBetweenNamedAndDefaultImports,
  isStylesImport,
  insertStylesImportsAtTheEnd,
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
      const stylesDeclarations: ImportDeclaration[] = [];

      importDeclarations.forEach((currentDeclaration, index) => {
        const prevDeclaration: ImportDeclaration | undefined =
          importDeclarations[index - 1];

        if (!prevDeclaration) {
          return;
        }

        if (isStylesImport(prevDeclaration)) {
          stylesDeclarations.push(prevDeclaration);
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

      insertStylesImportsAtTheEnd(
        context,
        stylesDeclarations,
        importDeclarations[importDeclarations.length - 1],
      );
    },
  }),
};

export default sortedImports;
