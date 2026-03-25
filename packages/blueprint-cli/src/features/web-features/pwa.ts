import type { FeatureManifest } from "../index.js";

export const pwaManifest: FeatureManifest = {
  id: "pwa",
  name: "Mobile Web / PWA",
  description: "Native-like mobile patterns, manifest, icons",
  category: "web-feature",
  cliFlag: "--with-pwa",
  filesToRemove: [
    "apps/web/src/lib/mobile-animations.ts",
    "apps/web/src/hooks/use-mobile.ts",
    "apps/web/public/manifest.json",
    "apps/web/public/icon-192.png",
    "apps/web/public/icon-512.png",
    "apps/web/public/apple-touch-icon.png",
  ],
  dirsToRemove: [
    "apps/web/src/components/layout",
    "apps/web/src/components/mobile",
  ],
  depsToRemove: {
    "apps/web": ["vaul"],
  },
  layoutPatches: [
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-line",
      match: 'manifest:',
    },
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-block",
      match: "appleWebApp:",
    },
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-block",
      match: "other:",
    },
  ],
  envKeysToRemove: [],
  i18nKeysToRemove: [],
  ruleFilesToRemove: ["014-mobile-web-patterns.mdc"],
  skillDirsToRemove: [],
  rootScriptsToRemove: [],
  turboTasksToRemove: [],
};
