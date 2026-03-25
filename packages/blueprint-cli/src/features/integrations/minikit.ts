import type { FeatureManifest } from "../index.js";

export const minikitManifest: FeatureManifest = {
  id: "minikit",
  name: "World MiniKit",
  description: "World App integration",
  category: "integration",
  cliFlag: "--with-minikit",
  filesToRemove: [
    "apps/web/src/components/minikit-provider.tsx",
    "apps/web/src/hooks/use-minikit.ts",
  ],
  dirsToRemove: ["apps/web/src/app/api/minikit"],
  depsToRemove: {
    "apps/web": ["@worldcoin/minikit-js", "@worldcoin/minikit-react"],
  },
  layoutPatches: [
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-import",
      match: "minikit-provider",
    },
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-wrapper",
      match: "WorldMiniKitProvider",
    },
  ],
  envKeysToRemove: [
    "NEXT_PUBLIC_WORLD_APP_ID",
    "WORLD_APP_DEV_PORTAL_API_KEY",
  ],
  i18nKeysToRemove: [],
  ruleFilesToRemove: ["015-world-miniapp.mdc"],
  skillDirsToRemove: [],
  rootScriptsToRemove: [],
  turboTasksToRemove: [],
};
