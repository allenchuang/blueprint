import type { FeatureManifest } from "../index.js";

export const privyManifest: FeatureManifest = {
  id: "privy",
  name: "Privy Auth",
  description: "Authentication via Privy (email, social, wallets)",
  category: "integration",
  cliFlag: "--with-privy",
  filesToRemove: [
    "apps/web/src/lib/privy.ts",
    "apps/web/src/components/privy-provider.tsx",
    // RN files (skipped if RN not included, handled by strip engine)
    "apps/react-native/lib/privy.ts",
  ],
  dirsToRemove: [],
  depsToRemove: {
    "apps/web": ["@privy-io/react-auth"],
    "apps/server": ["@privy-io/node"],
    "apps/react-native": [
      "@privy-io/expo",
      "@privy-io/expo-native-extensions",
      "fast-text-encoding",
      "react-native-get-random-values",
      "@ethersproject/shims",
    ],
  },
  layoutPatches: [
    // Web layout: remove Privy provider
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-import",
      match: "privy-provider",
    },
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-wrapper",
      match: "PrivyAuthProvider",
    },
    // Web use-auth.ts: remove Privy code
    {
      file: "apps/web/src/hooks/use-auth.ts",
      type: "remove-import",
      match: "@privy-io/react-auth",
    },
    {
      file: "apps/web/src/hooks/use-auth.ts",
      type: "remove-import",
      match: "privy",
    },
    {
      file: "apps/web/src/hooks/use-auth.ts",
      type: "remove-block",
      match: "function usePrivyAuth",
    },
    {
      file: "apps/web/src/hooks/use-auth.ts",
      type: "remove-line",
      match: "privy-auth-hook",
    },
    // Web auth-demo.tsx: remove Privy code
    {
      file: "apps/web/src/components/auth-demo.tsx",
      type: "remove-import",
      match: "@privy-io/react-auth",
    },
    {
      file: "apps/web/src/components/auth-demo.tsx",
      type: "remove-import",
      match: "privy",
    },
    {
      file: "apps/web/src/components/auth-demo.tsx",
      type: "remove-block",
      match: "function PrivyAuthDemoInner",
    },
    {
      file: "apps/web/src/components/auth-demo.tsx",
      type: "remove-line",
      match: "privy-auth-render",
    },
    // Web nav-auth.tsx: remove Privy code
    {
      file: "apps/web/src/components/nav-auth.tsx",
      type: "remove-import",
      match: "@privy-io/react-auth",
    },
    {
      file: "apps/web/src/components/nav-auth.tsx",
      type: "remove-import",
      match: "privy",
    },
    {
      file: "apps/web/src/components/nav-auth.tsx",
      type: "remove-block",
      match: "function PrivyNavAuthInner",
    },
    {
      file: "apps/web/src/components/nav-auth.tsx",
      type: "remove-line",
      match: "privy-auth-render",
    },
    // Server auth: remove Privy code
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-import",
      match: "@privy-io/node",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-line",
      match: "PRIVY_APP_ID",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-line",
      match: "PRIVY_APP_SECRET",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-line",
      match: "PRIVY_VERIFICATION_KEY",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-block",
      match: "privyClient",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-block",
      match: "upsertPrivyUser",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-block",
      match: "verifyPrivy",
    },
    // DB schema: remove privyUserId column
    {
      file: "packages/db/src/schema/users.ts",
      type: "remove-line",
      match: "privyUserId",
    },
    // RN layout: remove Privy wrapper
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-import",
      match: "privyEnabled",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-block",
      match: "function PrivyWrapper",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-wrapper",
      match: "PrivyWrapper",
    },
    // RN use-auth.ts: remove Privy code
    {
      file: "apps/react-native/hooks/use-auth.ts",
      type: "remove-import",
      match: "privy",
    },
    {
      file: "apps/react-native/hooks/use-auth.ts",
      type: "remove-block",
      match: "function usePrivyAuth",
    },
    {
      file: "apps/react-native/hooks/use-auth.ts",
      type: "remove-line",
      match: "privy-auth-hook",
    },
  ],
  envKeysToRemove: [
    "NEXT_PUBLIC_PRIVY_APP_ID",
    "NEXT_PUBLIC_PRIVY_CLIENT_ID",
    "EXPO_PUBLIC_PRIVY_APP_ID",
    "EXPO_PUBLIC_PRIVY_CLIENT_ID",
    "PRIVY_APP_ID",
    "PRIVY_APP_SECRET",
    "PRIVY_VERIFICATION_KEY",
  ],
  i18nKeysToRemove: [],
  ruleFilesToRemove: ["022-privy-auth.mdc"],
  skillDirsToRemove: [],
  rootScriptsToRemove: [],
  turboTasksToRemove: [],
  dependsOnRN: true,
};
