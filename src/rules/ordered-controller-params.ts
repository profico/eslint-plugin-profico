import { Rule, SourceCode } from "eslint";
import { ClassDeclaration, Program, Node } from "estree";
import { findImportsByPackageName } from "../utils/imports";
import { ProficoParam } from "../interfaces/profico-param.interface";
import { ProficoNodeBodyElement } from "../interfaces/profico-node-body-element.interface";

const orderedControllerParams: Rule.RuleModule = {
  meta: {
    fixable: "code",
    type: "problem",
    messages: {
      improperlyOrderedControllerParams: "Parameters are not properly ordered.",
    },
    docs: {
      url: "https://github.com/profico/eslint-plugin-profico#ordered-controller-params",
    },
  },
  create: context => {
    return {
      Program({ body }: Program) {
        const isFileController = findImportsByPackageName(
          body,
          "@nestjs/common",
        ).has("Controller");

        if (!isFileController) {
          return;
        }

        const paramsPriorityMap: Record<string, number> = {
          Ip: 1,
          HostName: 2,
          Param: 3,
          Query: 4,
          Headers: 5,
          Body: 6,
          Session: 7,
          Req: 8,
          Request: 9,
          Res: 10,
          Response: 11,
          Next: 12,
        };

        function getOrderedParams(
          params: ProficoParam[],
          sourceCode: SourceCode,
        ) {
          const nestParams: {
            orderValue: number;
            param: ProficoParam;
          }[] = [];

          const customParams: ProficoParam[] = [];

          for (let i = 0; i < params.length; i++) {
            const orderValue =
              paramsPriorityMap[params[i].decorators[0].expression.callee.name];

            if (orderValue) {
              nestParams.push({ orderValue, param: params[i] });
            } else {
              customParams.push(params[i]);
            }
          }

          const orderedParams = [
            ...nestParams
              .sort((a, b) => a.orderValue - b.orderValue)
              .map(el => el.param),
            ...customParams.sort((a, b) =>
              b.decorators[0].expression.callee.name >
              a.decorators[0].expression.callee.name
                ? -1
                : 1,
            ),
          ];

          const firstImportNode = params[0].decorators[0];
          const lastImportNode = params[params.length - 1];

          const numberOfSpacesInIndent =
            params[0].decorators[0].loc.start.column;

          return {
            params: orderedParams,
            text: orderedParams
              .map(
                node =>
                  `${sourceCode
                    .getText(node.decorators[0] as unknown as Node)
                    .trim()} ${sourceCode
                    .getText(node as unknown as Node)
                    .trim()}`,
              )
              .join(
                `,\n`.concat(
                  new Array(numberOfSpacesInIndent)
                    .fill(" ", 0, numberOfSpacesInIndent)
                    .join(""),
                ),
              ),
            start: firstImportNode.range ? firstImportNode.range[0] : 0,
            end: lastImportNode.range ? lastImportNode.range[1] : 0,
          };
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
          const classNodeBodyElement = classBody[
            i
          ] as unknown as ProficoNodeBodyElement;

          const params = classNodeBodyElement.value.params;

          if (
            classNodeBodyElement.type !== "MethodDefinition" ||
            classNodeBodyElement.decorators?.length === 0 ||
            params?.length === 0
          ) {
            continue;
          }

          const areAllParamsValidForLinting = params.every(
            el => el.decorators?.length === 1,
          );

          if (!areAllParamsValidForLinting) {
            continue;
          }

          const orderedParams = getOrderedParams(params, sourceCode);

          const originalParamNames = params.map(el => el.name).join();

          const orderedParamNames = orderedParams.params
            .map(el => el.name)
            .join();

          if (originalParamNames !== orderedParamNames) {
            context.report({
              messageId: "improperlyOrderedControllerParams",
              loc: {
                start: sourceCode.getLocFromIndex(orderedParams.start),
                end: sourceCode.getLocFromIndex(orderedParams.end),
              },
              fix: fixer =>
                fixer.replaceTextRange(
                  [orderedParams.start, orderedParams.end],
                  orderedParams.text,
                ),
            });
          }
        }
      },
    };
  },
};

export default orderedControllerParams;
