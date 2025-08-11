import { Rule } from "eslint";
import { TSESTree } from "@typescript-eslint/utils";
import { categorizeImports, processImportGroup } from "../utils/imports";

const typeImports: Rule.RuleModule = {
  meta: {
    fixable: "code",
    type: "problem",
    messages: {
      mixedTypeValueImports:
        "Type imports should be separated from value imports within each group.",
    },
    docs: {
      url: "https://github.com/profico/eslint-plugin-profico#type-imports",
    },
  },
  create(context) {
    return {
      Program(node) {
        const importNodes = node.body.filter(
          (stmt): stmt is TSESTree.ImportDeclaration =>
            stmt.type === "ImportDeclaration",
        );

        if (importNodes.length === 0) {
          return;
        }

        const { absoluteImports, relativeImports } =
          categorizeImports(importNodes);

        // Process absolute imports (may need trailing newline if relative imports exist)
        processImportGroup(
          absoluteImports,
          context,
          relativeImports.length > 0,
        );
        // Process relative imports (never needs trailing newline as it's the last group)
        processImportGroup(relativeImports, context, false);
      },
    };
  },
};

export default typeImports;
