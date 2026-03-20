import type { FeatureManifest } from "../index.js";

export const adminManifest: FeatureManifest = {
  id: "admin",
  name: "Admin Panel",
  description: "Next.js 15 admin dashboard",
  category: "app",
  cliFlag: "--with-admin",
  filesToRemove: [],
  dirsToRemove: ["apps/admin"],
  depsToRemove: {},
  layoutPatches: [],
  envKeysToRemove: [],
  i18nKeysToRemove: [],
  ruleFilesToRemove: [],
  skillDirsToRemove: [],
  rootScriptsToRemove: ["dev:admin"],
  turboTasksToRemove: [],
};
