import { Rule } from "eslint";

import { getGroupedImports, hasImports } from "../utils/imports";

const groupedImports: Rule.RuleModule = {
  meta: {
    fixable: "code",
    type: "problem",
    messages: {
      improperlyGrouped:
        "Import declarations are not grouped according to Profico's React Style Guide. Run autofix to group them.",
    },
    docs: {
      url: "https://github.com/profico/eslint-plugin-profico#grouped-imports",
    },
  },
  create: context => {
    return {
      Program: ({ body }) => {
        if (!hasImports(body)) {
          return null;
        }

        const sourceCode = context.getSourceCode();
        const grouped = getGroupedImports(context, body);
        const originalText = sourceCode
          .getText()
          .slice(grouped.start, grouped.end)
          .trim();

        if (grouped.text !== originalText) {
          context.report({
            messageId: "improperlyGrouped",
            loc: {
              start: sourceCode.getLocFromIndex(grouped.start),
              end: sourceCode.getLocFromIndex(grouped.end),
            },
            fix: fixer =>
              fixer.replaceTextRange(
                [grouped.start, grouped.end],
                grouped.text,
              ),
          });
        }
      },
    };
  },
};

export default groupedImports;
