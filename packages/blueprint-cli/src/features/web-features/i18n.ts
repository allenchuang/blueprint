import type { FeatureManifest } from "../index.js";

export const i18nManifest: FeatureManifest = {
  id: "i18n",
  name: "Internationalization (i18n)",
  description: "Multi-language support (en, zh, es)",
  category: "web-feature",
  cliFlag: "--with-i18n",
  filesToRemove: [
    "apps/web/src/components/i18n-provider.tsx",
    "packages/app-config/src/languages.json",
    // RN files
    "apps/react-native/i18n/index.ts",
  ],
  dirsToRemove: [
    "apps/web/src/i18n",
    "apps/react-native/i18n",
  ],
  depsToRemove: {
    "apps/web": ["i18next", "react-i18next", "i18next-browser-languagedetector"],
    "apps/react-native": ["i18next", "react-i18next", "expo-localization"],
  },
  layoutPatches: [
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-import",
      match: "i18n-provider",
    },
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-wrapper",
      match: "I18nProvider",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-import",
      match: "I18nextProvider",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-import",
      match: '../i18n"',
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-wrapper",
      match: "I18nextProvider",
    },
  ],
  envKeysToRemove: [],
  i18nKeysToRemove: [],
  ruleFilesToRemove: ["014-i18n.mdc"],
  skillDirsToRemove: [],
  rootScriptsToRemove: [],
  turboTasksToRemove: [],
  dependsOnRN: true,
};
