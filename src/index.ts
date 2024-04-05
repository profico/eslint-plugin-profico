import { Linter, Rule } from "eslint";

import recommendedConfig from "./configs/recommended";
import nestConfig from "./configs/nest";
import nextConfig from "./configs/next";
import reactConfig from "./configs/react";

import lodashImports from "./rules/lodash-imports";
import groupedImports from "./rules/grouped-imports";
import dtoDecorators from "./rules/dto-decorators";
import orderedControllerParams from "./rules/ordered-controller-params";

export const rules: Record<string, Rule.RuleModule> = {
  "lodash-imports": lodashImports,
  "grouped-imports": groupedImports,
  "dto-decorators": dtoDecorators,
  "ordered-controller-params": orderedControllerParams,
};

export const configs: Record<string, Linter.Config> = {
  recommended: recommendedConfig,
  nest: nestConfig,
  next: nextConfig,
  react: reactConfig,
};
