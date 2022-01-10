import { Linter, Rule } from "eslint";

import recommendedConfig from "./configs/recommended";

import lodashImports from "./rules/lodash-imports";
import groupedImports from "./rules/grouped-imports";

export const rules: Record<string, Rule.RuleModule> = {
  "lodash-imports": lodashImports,
  "grouped-imports": groupedImports,
};

export const configs: Record<string, Linter.Config> = {
  recommended: recommendedConfig,
};
