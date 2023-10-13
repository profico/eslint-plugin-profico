import { Rule, SourceCode } from "eslint";
import { ClassDeclaration, Program, Node } from "estree";
import { findImportsByPackageName } from "../utils/imports";

interface ProficoNodeBodyElement {
  decorators?: ProficoDecorator[];
  type: "PropertyDefinition";
}

interface ProficoDecorator {
  expression: {
    callee: {
      name: string;
    };
  };
  type: "Decorator";
  range: number[];
}

const IS_OPTIONAL = "IsOptional";

const dtoDecorators: Rule.RuleModule = {
  meta: {
    fixable: "code",
    type: "problem",
    messages: {
      improperlyOrderedDecorators: "Decorators are not properly ordered.",
    },
    docs: {
      url: "https://github.com/profico/eslint-plugin-profico#dto-decorators",
    },
  },
  create: context => {
    return {
      Program({ body }: Program) {
        const optionalDecorator = new Set([IS_OPTIONAL]);
        const allNonCustomDecorators = new Set([IS_OPTIONAL]);

        const swaggerDecorators: Set<string> = findImportsByPackageName(
          body,
          "@nestjs/swagger",
        );

        Array.from(swaggerDecorators).forEach(decorator => {
          allNonCustomDecorators.add(decorator);
        });

        const classTransformerDecorators: Set<string> =
          findImportsByPackageName(body, "class-transformer");

        Array.from(classTransformerDecorators).forEach(decorator => {
          allNonCustomDecorators.add(decorator);
        });

        const classValidatorDecorators: Set<string> = findImportsByPackageName(
          body,
          "class-validator",
        );

        Array.from(classValidatorDecorators).forEach(decorator => {
          allNonCustomDecorators.add(decorator);
        });

        function getOrderedDecorators(
          decorators: ProficoDecorator[],
          sourceCode: SourceCode,
        ) {
          const swaggerDecs = decorators.filter(dec =>
            swaggerDecorators.has(dec.expression.callee.name),
          );

          const classTransformerDecs = decorators.filter(dec =>
            classTransformerDecorators.has(dec.expression.callee.name),
          );

          const classValidatorDecs = decorators
            .filter(
              dec =>
                classValidatorDecorators.has(dec.expression.callee.name) &&
                dec.expression.callee.name !== IS_OPTIONAL,
            )
            .sort((a, b) =>
              b.expression.callee.name > a.expression.callee.name ? -1 : 1,
            );

          const optionalityDecs = decorators.filter(dec =>
            optionalDecorator.has(dec.expression.callee.name),
          );

          const customDecs = decorators
            .filter(
              dec => !allNonCustomDecorators.has(dec.expression.callee.name),
            )
            .sort((a, b) =>
              b.expression.callee.name > a.expression.callee.name ? -1 : 1,
            );

          const orderedDecorators = [
            ...swaggerDecs,
            ...classTransformerDecs,
            ...classValidatorDecs,
            ...optionalityDecs,
            ...customDecs,
          ];

          const firstImportNode = decorators[0];
          const lastImportNode = decorators[decorators.length - 1];

          return {
            decorators: orderedDecorators,
            text: orderedDecorators
              .map(node => sourceCode.getText(node as unknown as Node).trim())
              .join("\n  "),
            start: firstImportNode.range ? firstImportNode.range[0] : 0,
            end: lastImportNode.range ? lastImportNode.range[1] : 0,
          };
        }

        if (
          swaggerDecorators.size === 0 &&
          classValidatorDecorators.size === 0 &&
          classTransformerDecorators.size === 0
        ) {
          return;
        }

        const sourceCode = context.getSourceCode();

        const classNode = body.find(
          el =>
            el.type === "ClassDeclaration" ||
            ((el.type === "ExportNamedDeclaration" ||
              el.type === "ExportDefaultDeclaration") &&
              el.declaration?.type === "ClassDeclaration"),
        ) as ClassDeclaration | undefined;

        if (!classNode) {
          return;
        }

        const classBody =
          classNode.body?.body ||
          // @ts-expect-error
          classNode.declaration?.body?.body;

        if (!classBody) {
          return;
        }

        for (let i = 0; i < classBody.length; i++) {
          const classNodeBodyElement = classBody[i] as ProficoNodeBodyElement;

          if (
            classNodeBodyElement.type !== "PropertyDefinition" ||
            !classNodeBodyElement.decorators
          ) {
            continue;
          }

          const orderedDecorators = getOrderedDecorators(
            classNodeBodyElement.decorators,
            sourceCode,
          );

          const originalDecoratorNames = classNodeBodyElement.decorators
            .map(el => el.expression.callee.name)
            .join();
          const orderedDecoratorNames = orderedDecorators.decorators
            .map(el => el.expression.callee.name)
            .join();

          if (originalDecoratorNames !== orderedDecoratorNames) {
            context.report({
              messageId: "improperlyOrderedDecorators",
              loc: {
                start: sourceCode.getLocFromIndex(orderedDecorators.start),
                end: sourceCode.getLocFromIndex(orderedDecorators.end),
              },
              fix: fixer =>
                fixer.replaceTextRange(
                  [orderedDecorators.start, orderedDecorators.end],
                  orderedDecorators.text,
                ),
            });
          }
        }
      },
    };
  },
};

export default dtoDecorators;
