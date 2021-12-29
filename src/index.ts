import { Linter, Rule } from "eslint";

import lodashImports from "./rules/lodash-imports";
import recommendedConfig from "./configs/recommended";

export const rules: Record<string, Rule.RuleModule> = {
  "lodash-imports": lodashImports,
};

export const configs: Record<string, Linter.Config> = {
  recommended: recommendedConfig,
};
