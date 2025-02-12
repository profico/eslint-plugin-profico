import { Linter } from "eslint";

import nestConfig from "./configs/nest";
import nextConfig from "./configs/next";
import reactConfig from "./configs/react";

import { getConfigs, getRules } from "./utils/linter-config";

export const rules = getRules();

export const configs = getConfigs();

// Convert existing configs to flat config format
export function recommended(): Linter.Config[] {
  return [
    {
      plugins: {
        profico: {
          rules: getRules(true),
        },
      },
      rules: {
        "profico/lodash-imports": "error",
        "profico/grouped-imports": "error",
      },
    },
  ];
}

export function next(): Linter.Config[] {
  return [...recommended(), nextConfig];
}

export function react(): Linter.Config[] {
  return [...recommended(), reactConfig];
}

export function nest(): Linter.Config[] {
  return [...recommended(), nestConfig];
}
