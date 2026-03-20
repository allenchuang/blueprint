import type { FeatureManifest } from "../index.js";

export const dynamicManifest: FeatureManifest = {
  id: "dynamic",
  name: "Dynamic Auth",
  description: "Wallet-based authentication via Dynamic Labs",
  category: "integration",
  cliFlag: "--with-dynamic",
  filesToRemove: [
    "apps/web/src/lib/dynamic.ts",
    "apps/web/src/components/dynamic-provider.tsx",
    "apps/web/src/components/auth-demo.tsx",
    "apps/web/src/hooks/use-auth.ts",
    // Server auth plugin
    "apps/server/src/plugins/auth.ts",
    // DB schema: wallets + subaccounts
    "packages/db/src/schema/wallets.ts",
    // RN files (skipped if RN not included, handled by strip engine)
    "apps/react-native/lib/dynamic.ts",
    "apps/react-native/lib/dynamic-client.ts",
    "apps/react-native/hooks/use-auth.ts",
  ],
  dirsToRemove: [],
  depsToRemove: {
    "apps/web": ["@dynamic-labs/sdk-react-core"],
    "apps/server": ["jsonwebtoken", "jwks-rsa", "@types/jsonwebtoken"],
    "apps/react-native": ["@dynamic-labs/react-native-extension"],
  },
  layoutPatches: [
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-import",
      match: "dynamic-provider",
    },
    {
      file: "apps/web/src/app/layout.tsx",
      type: "remove-wrapper",
      match: "DynamicAuthProvider",
    },
    {
      file: "apps/web/src/app/page.tsx",
      type: "remove-import",
      match: "auth-demo",
    },
    {
      file: "apps/web/src/app/page.tsx",
      type: "remove-block",
      match: "<AuthDemo",
    },
    // Remove auth plugin import and registration from server app.ts
    {
      file: "apps/server/src/app.ts",
      type: "remove-import",
      match: "authPlugin",
    },
    {
      file: "apps/server/src/app.ts",
      type: "remove-line",
      match: "authPlugin",
    },
    // Remove dynamicUserId column from users schema
    {
      file: "packages/db/src/schema/users.ts",
      type: "remove-line",
      match: "dynamicUserId",
    },
    // Remove wallets exports from schema barrel
    {
      file: "packages/db/src/schema/index.ts",
      type: "remove-block",
      match: '"./wallets"',
    },
    // RN layout patches
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-import",
      match: "dynamicEnabled",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-block",
      match: "function DynamicWrapper",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-wrapper",
      match: "DynamicWrapper",
    },
  ],
  envKeysToRemove: [
    "NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID",
    "EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID",
    "DYNAMIC_ENVIRONMENT_ID",
    "INFRA_API_URL",
  ],
  i18nKeysToRemove: [
    "login",
    "logout",
    "loggedInAs",
    "authNotConfigured",
    "authNotConfiguredHint",
  ],
  ruleFilesToRemove: ["020-dynamic-auth.mdc"],
  skillDirsToRemove: [],
  rootScriptsToRemove: [],
  turboTasksToRemove: [],
  dependsOnRN: true,
};
