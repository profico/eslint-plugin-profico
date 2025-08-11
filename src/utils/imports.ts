import { Rule } from "eslint";
import {
  Directive,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ModuleDeclaration,
  Node,
  Statement,
} from "estree";
import { TSESTree } from "@typescript-eslint/utils";
import type { SourceCode } from "eslint";

type GroupedImportsResult = {
  start: number;
  end: number;
  text: string;
};
type ImportGroup = Record<
  "namespace" | "default" | "named",
  ImportDeclaration[]
>;
type DividerType = Record<"type" | "value", string>;

function isImportDeclaration(node: Node): node is ImportDeclaration {
  return node.type === "ImportDeclaration";
}

function getImportSourceValue(declaration: ImportDeclaration): string {
  return declaration.source.value?.toString() || "";
}

function isRelativeImport(declaration: ImportDeclaration): boolean {
  return getImportSourceValue(declaration).includes("./");
}

function isAbsoluteImport(declaration: ImportDeclaration): boolean {
  return !isRelativeImport(declaration);
}

export function isDefaultImport(node: Node): node is ImportDefaultSpecifier {
  return (
    "specifiers" in node &&
    node.specifiers.length > 0 &&
    node.specifiers[0].type === "ImportDefaultSpecifier"
  );
}

export function hasNamedImports(declaration: ImportDeclaration): boolean {
  return (
    declaration.specifiers.find(node => node.type === "ImportSpecifier") !==
    undefined
  );
}

export function isNamespaceImport(
  node: Node,
): node is ImportNamespaceSpecifier {
  return (
    "specifiers" in node &&
    node.specifiers.length > 0 &&
    node.specifiers[0].type === "ImportNamespaceSpecifier"
  );
}

function isGlobalImport({ specifiers }: ImportDeclaration): boolean {
  return specifiers.length === 0;
}

function isStylesImport(declaration: ImportDeclaration): boolean {
  const sourceValue = getImportSourceValue(declaration);
  const styleExtensions: string[] = [
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".style", // css-in-js solutions should follow the *.style.(js|ts) naming convention
  ];

  const match = styleExtensions.find(
    ext => sourceValue.endsWith(ext) || sourceValue.includes(ext),
  );

  return match !== undefined;
}

// Mainly used with 'use strict' statements
function isPossibleDirective(node: Node): boolean {
  return (
    node.type === "ExpressionStatement" &&
    node.expression.type === "Literal" &&
    typeof node.expression.value === "string"
  );
}

function getGroupChunk(group: ImportGroup, declaration: ImportDeclaration) {
  if (isNamespaceImport(declaration)) {
    return group.namespace;
  }

  return isDefaultImport(declaration) ? group.default : group.named;
}

const divider: DividerType = {
  type: "Divider",
  value: "",
};

function isDivider(node: Node | DividerType): node is DividerType {
  return node.type === "Divider";
}

function makeGroup(
  group: (Node | ImportDeclaration)[],
): (Node | ImportDeclaration | DividerType)[] {
  return group.length > 0 ? [...group, divider] : [];
}

function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean,
): number {
  let l = array.length;

  while (l--) {
    if (predicate(array[l], l, array)) {
      return l;
    }
  }

  return -1;
}

export function hasImports(body: Node[]): boolean {
  return body.find(node => isImportDeclaration(node)) !== undefined;
}

export function getGroupedImports(
  context: Rule.RuleContext,
  body: Node[],
): GroupedImportsResult {
  const startIndex = body.findIndex(
    node => isPossibleDirective(node) || isImportDeclaration(node),
  );
  const endIndex = findLastIndex(
    body,
    node => isPossibleDirective(node) || isImportDeclaration(node),
  );
  const nodesToGroup = [...body].slice(startIndex, endIndex + 1);

  const directives: Node[] = [];
  const globalImports: ImportDeclaration[] = [];
  const absoluteImportsGroup: ImportGroup = {
    namespace: [],
    default: [],
    named: [],
  };
  const relativeImportsGroup: ImportGroup = {
    namespace: [],
    default: [],
    named: [],
  };
  const stylesImports: ImportDeclaration[] = [];
  const restOfNodes: ImportDeclaration[] = [];

  nodesToGroup.forEach(node => {
    let targetGroup: (ImportDeclaration | Node)[] = restOfNodes;

    if (isPossibleDirective(node)) {
      targetGroup = directives;
    } else if (isImportDeclaration(node)) {
      // Only group import declarations from now on
      if (isGlobalImport(node)) {
        targetGroup = globalImports;
      } else if (isStylesImport(node)) {
        targetGroup = stylesImports;
      } else {
        targetGroup = getGroupChunk(
          isAbsoluteImport(node) ? absoluteImportsGroup : relativeImportsGroup,
          node,
        );
      }
    }

    targetGroup.push(node);
  });

  const grouped: ReturnType<typeof makeGroup> = [
    ...makeGroup(directives),
    ...makeGroup(globalImports),
    ...makeGroup(absoluteImportsGroup.namespace),
    ...makeGroup(absoluteImportsGroup.default),
    ...makeGroup(absoluteImportsGroup.named),
    ...makeGroup(relativeImportsGroup.namespace),
    ...makeGroup(relativeImportsGroup.default),
    ...makeGroup(relativeImportsGroup.named),
    ...makeGroup(stylesImports),
    ...restOfNodes,
  ];

  const firstImportNode = nodesToGroup[0];
  const lastImportNode = nodesToGroup[nodesToGroup.length - 1];
  const sourceCode = context.getSourceCode();

  return {
    text: grouped
      .map(node =>
        isDivider(node) ? node.value : sourceCode.getText(node).trim(),
      )
      .join("\n")
      .trim(),
    start: firstImportNode.range ? firstImportNode.range[0] : 0,
    end: lastImportNode.range ? lastImportNode.range[1] : 0,
  };
}

export function findImportsByPackageName(
  body: (ModuleDeclaration | Statement | Directive)[],
  packageName: string,
): Set<string> {
  const importedSet = new Set<string>();

  const importDeclarations = body.find(
    el => el.type === "ImportDeclaration" && el.source.value === packageName,
  ) as ImportDeclaration;

  if (!importDeclarations) {
    return importedSet;
  }

  const importTokens = importDeclarations.specifiers.filter(
    el => el.type === "ImportSpecifier",
  );

  importTokens.forEach(importToken => {
    if (!importedSet.has(importToken.local.name)) {
      importedSet.add(importToken.local.name);
    }
  });

  return importedSet;
}

// Type imports utility functions (for type-imports rule)
export function isTypeImportDeclaration(
  importNode: TSESTree.ImportDeclaration,
  sourceCode: SourceCode,
): boolean {
  const specifiers = importNode.specifiers.filter(
    (spec): spec is TSESTree.ImportSpecifier => spec.type === "ImportSpecifier",
  );

  const hasTypeSpecifiers = specifiers.some(spec => spec.importKind === "type");

  // Check if it's a pure type import (starts with "import type")
  const sourceText = sourceCode.getText(importNode);
  const isPureTypeImport = /^\s*import\s+type\b/.test(sourceText);

  return isPureTypeImport || hasTypeSpecifiers;
}

export function isValueImportDeclaration(
  importNode: TSESTree.ImportDeclaration,
): boolean {
  const specifiers = importNode.specifiers.filter(
    (spec): spec is TSESTree.ImportSpecifier => spec.type === "ImportSpecifier",
  );

  const hasValueSpecifiers = specifiers.some(
    spec => spec.importKind !== "type",
  );

  // Default imports or namespace imports go with value imports
  const hasDefaultOrNamespace = importNode.specifiers.some(
    spec =>
      spec.type === "ImportDefaultSpecifier" ||
      spec.type === "ImportNamespaceSpecifier",
  );

  return hasValueSpecifiers || hasDefaultOrNamespace || specifiers.length === 0;
}

export function separateImportsByType(
  imports: TSESTree.ImportDeclaration[],
  sourceCode: SourceCode,
): {
  valueImports: TSESTree.ImportDeclaration[];
  typeImports: TSESTree.ImportDeclaration[];
} {
  const valueImports: TSESTree.ImportDeclaration[] = [];
  const typeImports: TSESTree.ImportDeclaration[] = [];

  imports.forEach(importNode => {
    if (isTypeImportDeclaration(importNode, sourceCode)) {
      typeImports.push(importNode);
    } else if (isValueImportDeclaration(importNode)) {
      valueImports.push(importNode);
    } else {
      // Default case: treat as value import
      valueImports.push(importNode);
    }
  });

  return { valueImports, typeImports };
}

export function areImportsInterleaved(
  valueImports: TSESTree.ImportDeclaration[],
  typeImports: TSESTree.ImportDeclaration[],
): boolean {
  if (valueImports.length === 0 || typeImports.length === 0) {
    return false;
  }

  // Sort imports by their position in the source code
  const allImports = [...valueImports, ...typeImports].sort(
    (a, b) => a.range![0] - b.range![0],
  );

  // Optimize membership checks using a Set
  const typeSet = new Set(typeImports);

  // Check if type and value imports are interleaved
  let foundType = false;
  for (const importNode of allImports) {
    const isTypeImport = typeSet.has(importNode);

    if (isTypeImport) {
      foundType = true;
    } else if (foundType) {
      // Found a value import after a type import - they're interleaved
      return true;
    }
  }

  return false;
}

// Sort each group alphabetically by source, then by original position for stability
const sortBySource = (
  a: TSESTree.ImportDeclaration,
  b: TSESTree.ImportDeclaration,
) => {
  const sourceA = a.source.value?.toString() || "";
  const sourceB = b.source.value?.toString() || "";
  const bySource = sourceA.localeCompare(sourceB);
  if (bySource !== 0) return bySource;
  return (a.range?.[0] ?? 0) - (b.range?.[0] ?? 0);
};

export function sortImportsByType(
  imports: TSESTree.ImportDeclaration[],
): TSESTree.ImportDeclaration[] {
  const namespaceImports: TSESTree.ImportDeclaration[] = [];
  const defaultImports: TSESTree.ImportDeclaration[] = [];
  const namedImports: TSESTree.ImportDeclaration[] = [];

  imports.forEach(imp => {
    const hasNamespaceImport = imp.specifiers.some(
      spec => spec.type === "ImportNamespaceSpecifier",
    );
    const hasDefaultImport = imp.specifiers.some(
      spec => spec.type === "ImportDefaultSpecifier",
    );
    const hasNamedImports = imp.specifiers.some(
      spec => spec.type === "ImportSpecifier",
    );

    if (hasNamespaceImport) {
      namespaceImports.push(imp);
    } else if (hasDefaultImport && !hasNamedImports) {
      defaultImports.push(imp);
    } else {
      namedImports.push(imp);
    }
  });

  return [
    ...namespaceImports.sort(sortBySource),
    ...defaultImports.sort(sortBySource),
    ...namedImports.sort(sortBySource),
  ];
}

export function generateFixedImportsText(
  valueImports: TSESTree.ImportDeclaration[],
  typeImports: TSESTree.ImportDeclaration[],
  sourceCode: SourceCode,
): string {
  const sortedValueImports = sortImportsByType(valueImports);
  const sortedTypeImports = sortImportsByType(typeImports);

  const valueImportsText = sortedValueImports
    .map(imp => sourceCode.getText(imp))
    .join("\n");
  const typeImportsText = sortedTypeImports
    .map(imp => sourceCode.getText(imp))
    .join("\n");

  return valueImportsText + "\n\n" + typeImportsText;
}

export function getImportRange(
  imports: TSESTree.ImportDeclaration[],
): [number, number] {
  const startIndex = Math.min(...imports.map(imp => imp.range![0]));
  const endIndex = Math.max(...imports.map(imp => imp.range![1]));
  return [startIndex, endIndex];
}

export function categorizeImports(imports: TSESTree.ImportDeclaration[]): {
  absoluteImports: TSESTree.ImportDeclaration[];
  relativeImports: TSESTree.ImportDeclaration[];
} {
  const absoluteImports: TSESTree.ImportDeclaration[] = [];
  const relativeImports: TSESTree.ImportDeclaration[] = [];

  imports.forEach(importNode => {
    if (isRelativeImport(importNode)) {
      relativeImports.push(importNode);
    } else {
      absoluteImports.push(importNode);
    }
  });

  return { absoluteImports, relativeImports };
}

export function processImportGroup(
  imports: TSESTree.ImportDeclaration[],
  context: Rule.RuleContext,
) {
  if (imports.length === 0) return;

  const { valueImports, typeImports } = separateImportsByType(
    imports,
    context.sourceCode,
  );

  if (areImportsInterleaved(valueImports, typeImports)) {
    const firstTypeImport = typeImports[0];
    context.report({
      node: firstTypeImport,
      messageId: "mixedTypeValueImports",
      fix: fixer => {
        const allImports = [...valueImports, ...typeImports];
        const [startIndex, endIndex] = getImportRange(allImports);
        const replacement = generateFixedImportsText(
          valueImports,
          typeImports,
          context.sourceCode,
        );

        return fixer.replaceTextRange([startIndex, endIndex], replacement);
      },
    });
  }
}
