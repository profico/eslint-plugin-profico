import { Linter, Rule } from "eslint";

import recommendedConfig from "./configs/recommended";

import lodashImports from "./rules/lodash-imports";
import sortedImports from "./rules/sorted-imports";

export const rules: Record<string, Rule.RuleModule> = {
  "lodash-imports": lodashImports,
  "sorted-imports": sortedImports,
};

export const configs: Record<string, Linter.Config> = {
  recommended: recommendedConfig,
};
