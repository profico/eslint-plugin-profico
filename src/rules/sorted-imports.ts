import { Rule } from "eslint";

import { getSortedImports, hasImports } from "../utils/imports";

const sortedImports: Rule.RuleModule = {
  meta: {
    fixable: "code",
    type: "problem",
    messages: {
      improperlySorted:
        "Import declarations are not sorted according to Profico's React Style Guide. Run autofix to sort them.",
    },
    docs: {
      url: "https://github.com/profico/eslint-plugin-profico#sorted-imports",
    },
  },
  create: context => {
    return {
      Program: ({ body }) => {
        if (!hasImports(body)) {
          return null;
        }

        const sourceCode = context.getSourceCode();
        const sorted = getSortedImports(context, body);
        const originalText = sourceCode
          .getText()
          .slice(sorted.start, sorted.end)
          .trim();

        if (sorted.text !== originalText) {
          context.report({
            messageId: "improperlySorted",
            loc: {
              start: sourceCode.getLocFromIndex(sorted.start),
              end: sourceCode.getLocFromIndex(sorted.end),
            },
            fix: fixer =>
              fixer.replaceTextRange([sorted.start, sorted.end], sorted.text),
          });
        }
      },
    };
  },
};

export default sortedImports;
