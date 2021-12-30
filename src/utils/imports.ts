import { Rule } from "eslint";
import { ImportDeclaration, SourceLocation } from "estree";

import { SortedImportsMessages } from "./messages";

export const getSourceLocation = (
  defaultLoc?: SourceLocation | null,
): SourceLocation =>
  defaultLoc || {
    start: {
      column: 0,
      line: 0,
    },
    end: {
      column: 0,
      line: 0,
    },
  };

const getSourceValue = (declaration: ImportDeclaration): string =>
  declaration.source.value?.toString() || "";

const isRelativeImport = (declaration: ImportDeclaration): boolean =>
  getSourceValue(declaration).includes("./");

const isDefaultImport = (declaration: ImportDeclaration): boolean =>
  declaration.specifiers[0].type === "ImportDefaultSpecifier";

export const isStylesImport = (declaration: ImportDeclaration): boolean => {
  const sourceValue = getSourceValue(declaration);

  return (
    sourceValue.endsWith("css") ||
    sourceValue.endsWith(".style.ts") ||
    sourceValue.endsWith(".style.js")
  );
};

export const getImportStatement = ({
  source,
  specifiers,
}: ImportDeclaration): string => {
  const firstSpecifier = specifiers[0];
  const hasDefaultImport = firstSpecifier.type === "ImportDefaultSpecifier";
  const imports: string[] = specifiers
    .slice(hasDefaultImport ? 1 : 0)
    .map(spec => spec.local.name);
  const importKeyword: string = `import${
    hasDefaultImport ? ` ${firstSpecifier.local.name}` : ""
  }`;
  const namedImports = `{ ${imports.join(", ")} }`;
  const importedVariables: string =
    imports.length > 0
      ? `${hasDefaultImport ? ", " : ""}${
          !hasDefaultImport ? " " : ""
        }${namedImports}`
      : "";

  return `${importKeyword}${importedVariables} from '${source.value}';`;
};

export const moveRelativeAfterAbsoluteImports = (
  context: Rule.RuleContext,
  prevDeclaration: ImportDeclaration,
  currentDeclaration: ImportDeclaration,
): void => {
  if (
    isRelativeImport(prevDeclaration) &&
    !isRelativeImport(currentDeclaration)
  ) {
    context.report({
      message: SortedImportsMessages.RELATIVE_AFTER_ABSOLUTE,
      loc: getSourceLocation(prevDeclaration.loc),
      node: prevDeclaration,
      fix: fixer => [
        fixer.replaceText(
          prevDeclaration,
          getImportStatement(currentDeclaration),
        ),
        fixer.replaceText(
          currentDeclaration,
          getImportStatement(prevDeclaration),
        ),
      ],
    });
  }
};

export const moveNamedAfterDefaultImports = (
  context: Rule.RuleContext,
  prevDeclaration: ImportDeclaration,
  currentDeclaration: ImportDeclaration,
): void => {
  if (
    !isDefaultImport(prevDeclaration) &&
    isDefaultImport(currentDeclaration) &&
    !isRelativeImport(currentDeclaration)
  ) {
    context.report({
      message: SortedImportsMessages.NAMED_AFTER_DEFAULT,
      loc: getSourceLocation(prevDeclaration.loc),
      node: prevDeclaration,
      fix: fixer => [
        fixer.replaceText(
          prevDeclaration,
          getImportStatement(currentDeclaration),
        ),
        fixer.replaceText(
          currentDeclaration,
          getImportStatement(prevDeclaration),
        ),
      ],
    });
  }
};

export const insertEmptyLineBetweenNamedAndDefaultImports = (
  context: Rule.RuleContext,
  prevDeclaration: ImportDeclaration,
  currentDeclaration: ImportDeclaration,
): void => {
  if (
    (isDefaultImport(prevDeclaration) &&
      !isDefaultImport(currentDeclaration)) ||
    (!isDefaultImport(prevDeclaration) && isDefaultImport(currentDeclaration))
  ) {
    const prevSourceLocation = getSourceLocation(prevDeclaration.loc);
    const currentSourceLocation = getSourceLocation(currentDeclaration.loc);

    if (
      currentSourceLocation.start.line - prevSourceLocation.start.line ===
      1
    ) {
      context.report({
        message: SortedImportsMessages.LINE_BETWEEN_DEFAULT_AND_NAMED,
        loc: getSourceLocation(currentDeclaration.loc),
        node: currentDeclaration,
        fix: fixer => fixer.insertTextAfter(prevDeclaration, "\n"),
      });
    }
  }
};
