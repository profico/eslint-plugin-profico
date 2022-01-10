import { Rule } from "eslint";
import {
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  Node,
} from "estree";

type SortedImportsResult = {
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

function isNamespaceImport(node: Node): node is ImportNamespaceSpecifier {
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

  return (
    sourceValue.endsWith("css") ||
    sourceValue.endsWith("sass") ||
    sourceValue.endsWith("less") ||
    sourceValue.endsWith(".style.ts") ||
    sourceValue.endsWith(".style.js")
  );
}

// Mainly used with 'use strict' statements
function isPossibleDirective(node: Node): boolean {
  return (
    node.type === "ExpressionStatement" &&
    node.expression.type === "Literal" &&
    typeof node.expression.value === "string"
  );
}

const SortResult = {
  SAME: 0,
  AFTER: 1,
  BEFORE: -1,
} as const;

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

export function getSortedImports(
  context: Rule.RuleContext,
  body: Node[],
): SortedImportsResult {
  const startIndex = body.findIndex(
    node => isPossibleDirective(node) || isImportDeclaration(node),
  );
  const endIndex = findLastIndex(
    body,
    node => isPossibleDirective(node) || isImportDeclaration(node),
  );
  const nodesToSort = [...body].slice(startIndex, endIndex + 1);

  const sorted: Node[] = [...nodesToSort].sort((current, prev) => {
    if (
      // Move directives like `use strict;` to the top of the file
      (!isPossibleDirective(prev) && isPossibleDirective(current)) ||
      // Move import declarations to top, right after directives
      (!isImportDeclaration(prev) && isImportDeclaration(current))
    ) {
      return SortResult.BEFORE;
    }

    // Bail if both nodes aren't import declarations
    if (!isImportDeclaration(prev) || !isImportDeclaration(current)) {
      return SortResult.SAME;
    }

    if (
      // Move global imports to the start of import declarations
      (!isGlobalImport(prev) && isGlobalImport(current)) ||
      // Move relative imports after absolute imports
      // i.e. sort between relative/absolute groups
      (isRelativeImport(prev) && isAbsoluteImport(current))
    ) {
      return SortResult.BEFORE;
    }

    // Sort inside relative/absolute groups
    if (
      (isAbsoluteImport(prev) && isAbsoluteImport(current)) ||
      (isRelativeImport(prev) && isRelativeImport(current))
    ) {
      if (isNamespaceImport(prev)) {
        return SortResult.SAME;
      }

      if (
        (isGlobalImport(prev) || !isAbsoluteImport(prev)) &&
        !isRelativeImport(prev)
      ) {
        return SortResult.SAME;
      }

      // Move default imports after namespace imports
      if (isDefaultImport(prev) && isNamespaceImport(current)) {
        return SortResult.BEFORE;
      }

      if (isStylesImport(current)) {
        return SortResult.SAME;
      }

      // Sort named imports after default imports
      if (!isDefaultImport(prev) && isDefaultImport(current)) {
        return SortResult.BEFORE;
      }
    }

    // Sort styles imports to the bottom of import declarations
    if (isStylesImport(prev) && !isStylesImport(current)) {
      return SortResult.BEFORE;
    }

    return SortResult.SAME;
  });

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

  sorted.forEach(node => {
    let targetGroup: (ImportDeclaration | Node)[] = restOfNodes;

    if (isPossibleDirective(node)) {
      targetGroup = directives;
    }

    // Only group import declarations from now on
    if (isImportDeclaration(node)) {
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

  const firstImportNode = nodesToSort[0];
  const lastImportNode = nodesToSort[nodesToSort.length - 1];

  return {
    text: grouped
      .map(node =>
        isDivider(node)
          ? node.value
          : context.getSourceCode().getText(node).trim(),
      )
      .join("\n")
      .trim(),
    start: firstImportNode.range ? firstImportNode.range[0] : 0,
    end: lastImportNode.range ? lastImportNode.range[1] : 0,
  };
}
