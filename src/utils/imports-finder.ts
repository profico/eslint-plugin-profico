import {
  Directive,
  ImportDeclaration,
  ModuleDeclaration,
  Statement,
} from "estree";

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
