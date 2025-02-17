import { Linter, Rule } from "eslint";

import lodashImports from "../rules/lodash-imports";
import groupedImports from "../rules/grouped-imports";
import recommendedConfig from "../configs/recommended";
import nestConfig from "../configs/nest";
import nextConfig from "../configs/next";
import reactConfig from "../configs/react";
import dtoDecorators from "../rules/dto-decorators";
import orderedControllerParams from "../rules/ordered-controller-params";

type RegularRulesNames =
  | "lodash-imports"
  | "grouped-imports"
  | "dto-decorators"
  | "ordered-controller-params";
type FlatRulesNames = `profico/${RegularRulesNames}`;

export function getRules(
  flat?: false,
): Record<RegularRulesNames, Rule.RuleModule>;
export function getRules(flat?: true): Record<FlatRulesNames, Rule.RuleModule>;
export function getRules(
  flat = false,
):
  | Record<RegularRulesNames, Rule.RuleModule>
  | Record<FlatRulesNames, Rule.RuleModule> {
  if (flat) {
    return {
      "profico/lodash-imports": lodashImports,
      "profico/grouped-imports": groupedImports,
      "profico/dto-decorators": dtoDecorators,
      "profico/ordered-controller-params": orderedControllerParams,
    };
  }

  return {
    "lodash-imports": lodashImports,
    "grouped-imports": groupedImports,
    "dto-decorators": dtoDecorators,
    "ordered-controller-params": orderedControllerParams,
  };
}

export function getConfigs(): Record<
  "recommended" | "nest" | "next" | "react",
  Linter.Config
> {
  return {
    recommended: recommendedConfig(),
    nest: nestConfig,
    next: nextConfig,
    react: reactConfig,
  };
}
