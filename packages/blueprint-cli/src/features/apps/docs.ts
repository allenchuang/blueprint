import type { FeatureManifest } from "../index.js";

export const docsManifest: FeatureManifest = {
  id: "docs",
  name: "Documentation",
  description: "Mintlify documentation site",
  category: "app",
  cliFlag: "--with-docs",
  filesToRemove: [],
  dirsToRemove: ["apps/docs"],
  depsToRemove: {},
  layoutPatches: [],
  envKeysToRemove: [],
  i18nKeysToRemove: [],
  ruleFilesToRemove: ["004-docs-patterns.mdc"],
  skillDirsToRemove: [],
  rootScriptsToRemove: ["dev:docs"],
  turboTasksToRemove: [],
};
