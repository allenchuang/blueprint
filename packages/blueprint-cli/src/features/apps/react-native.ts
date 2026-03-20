import type { FeatureManifest } from "../index.js";

export const reactNativeManifest: FeatureManifest = {
  id: "mobile",
  name: "React Native",
  description: "Expo + Expo Router mobile app",
  category: "app",
  cliFlag: "--with-mobile",
  filesToRemove: [],
  dirsToRemove: ["apps/react-native"],
  depsToRemove: {},
  layoutPatches: [],
  envKeysToRemove: [],
  i18nKeysToRemove: [],
  ruleFilesToRemove: ["001-co-development.mdc"],
  skillDirsToRemove: [],
  rootScriptsToRemove: [],
  turboTasksToRemove: [],
};
