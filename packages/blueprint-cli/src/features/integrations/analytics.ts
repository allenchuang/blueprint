import type { FeatureManifest } from "../index.js";

export const analyticsManifest: FeatureManifest = {
  id: "analytics",
  name: "Google Analytics",
  description: "Web + mobile analytics (GA4)",
  category: "integration",
  cliFlag: "--with-analytics",
  filesToRemove: [
    // RN files
    "apps/react-native/lib/analytics.ts",
    "apps/react-native/hooks/use-screen-tracking.ts",
  ],
  dirsToRemove: [],
  depsToRemove: {
    "apps/web": ["@next/third-parties"],
  },
  layoutPatches: [
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-import",
      match: "@next/third-parties/google",
    },
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-line",
      match: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
    },
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-line",
      match: "gaId &&",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-import",
      match: "use-screen-tracking",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-line",
      match: "useScreenTracking",
    },
  ],
  envKeysToRemove: [
    "NEXT_PUBLIC_GA_MEASUREMENT_ID",
    "EXPO_PUBLIC_GA_MEASUREMENT_ID",
    "EXPO_PUBLIC_GA_API_SECRET",
  ],
  i18nKeysToRemove: [],
  ruleFilesToRemove: [],
  skillDirsToRemove: [],
  rootScriptsToRemove: [],
  turboTasksToRemove: [],
  dependsOnRN: true,
};
