import { Rule } from "eslint";
import {
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  Node,
} from "estree";

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
    sourceValue.includes("style")
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
