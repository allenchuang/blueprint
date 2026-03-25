import type { FeatureManifest } from "../index.js";

export const remotionManifest: FeatureManifest = {
  id: "remotion",
  name: "Remotion",
  description: "Programmatic video generation",
  category: "app",
  cliFlag: "--with-remotion",
  filesToRemove: [],
  dirsToRemove: ["apps/remotion", "prompts"],
  depsToRemove: {},
  layoutPatches: [],
  envKeysToRemove: [],
  i18nKeysToRemove: [],
  ruleFilesToRemove: ["011-remotion-branding.mdc"],
  skillDirsToRemove: ["remotion-best-practices"],
  rootScriptsToRemove: ["dev:remotion"],
  turboTasksToRemove: ["render"],
};
