import type { FeatureManifest } from "../index.js";

export const dynamicManifest: FeatureManifest = {
  id: "dynamic",
  name: "Dynamic Auth",
  description: "Email OTP authentication via Dynamic Labs",
  category: "integration",
  cliFlag: "--with-dynamic",
  filesToRemove: [
    "apps/web/src/lib/dynamic.ts",
    "apps/web/src/components/dynamic-provider.tsx",
    // DB schema: wallets + subaccounts
    "packages/db/src/schema/wallets.ts",
    // RN files (skipped if RN not included, handled by strip engine)
    "apps/react-native/lib/dynamic.ts",
    "apps/react-native/lib/dynamic-client.ts",
  ],
  dirsToRemove: [],
  depsToRemove: {
    "apps/web": ["@dynamic-labs/sdk-react-core"],
    "apps/server": ["jsonwebtoken", "jwks-rsa", "@types/jsonwebtoken"],
    "apps/react-native": ["@dynamic-labs/react-native-extension"],
  },
  layoutPatches: [
    // Web layout: remove Dynamic provider
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
    // Web use-auth.ts: remove Dynamic code
    {
      file: "apps/web/src/hooks/use-auth.ts",
      type: "remove-import",
      match: "@dynamic-labs/sdk-react-core",
    },
    {
      file: "apps/web/src/hooks/use-auth.ts",
      type: "remove-import",
      match: "dynamicEnabled",
    },
    {
      file: "apps/web/src/hooks/use-auth.ts",
      type: "remove-block",
      match: "function useDynamicAuth",
    },
    {
      file: "apps/web/src/hooks/use-auth.ts",
      type: "remove-line",
      match: "dynamic-auth-hook",
    },
    // Web auth-demo.tsx: remove Dynamic code
    {
      file: "apps/web/src/components/auth-demo.tsx",
      type: "remove-import",
      match: "@dynamic-labs/sdk-react-core",
    },
    {
      file: "apps/web/src/components/auth-demo.tsx",
      type: "remove-import",
      match: "dynamicEnabled",
    },
    {
      file: "apps/web/src/components/auth-demo.tsx",
      type: "remove-block",
      match: "function DynamicAuthDemoInner",
    },
    {
      file: "apps/web/src/components/auth-demo.tsx",
      type: "remove-line",
      match: "dynamic-auth-render",
    },
    // Web nav-auth.tsx: remove Dynamic code
    {
      file: "apps/web/src/components/nav-auth.tsx",
      type: "remove-import",
      match: "@dynamic-labs/sdk-react-core",
    },
    {
      file: "apps/web/src/components/nav-auth.tsx",
      type: "remove-import",
      match: "dynamicEnabled",
    },
    {
      file: "apps/web/src/components/nav-auth.tsx",
      type: "remove-block",
      match: "function DynamicNavAuthInner",
    },
    {
      file: "apps/web/src/components/nav-auth.tsx",
      type: "remove-line",
      match: "dynamic-auth-render",
    },
    // Server auth: remove Dynamic code
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-import",
      match: "jsonwebtoken",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-import",
      match: "jwks-rsa",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-line",
      match: "DYNAMIC_ENVIRONMENT_ID",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-block",
      match: "jwksClient",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-block",
      match: "upsertDynamicUser",
    },
    {
      file: "apps/server/src/plugins/auth.ts",
      type: "remove-block",
      match: "verifyDynamic",
    },
    // DB schema: remove dynamicUserId column
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
    // RN layout: remove Dynamic wrapper
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
    // RN use-auth.ts: remove Dynamic code
    {
      file: "apps/react-native/hooks/use-auth.ts",
      type: "remove-import",
      match: "dynamicEnabled",
    },
    {
      file: "apps/react-native/hooks/use-auth.ts",
      type: "remove-block",
      match: "function useDynamicAuth",
    },
    {
      file: "apps/react-native/hooks/use-auth.ts",
      type: "remove-line",
      match: "dynamic-auth-hook",
    },
  ],
  envKeysToRemove: [
    "NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID",
    "EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID",
    "DYNAMIC_ENVIRONMENT_ID",
    "INFRA_API_URL",
  ],
  i18nKeysToRemove: [],
  ruleFilesToRemove: ["020-dynamic-auth.mdc"],
  skillDirsToRemove: [],
  rootScriptsToRemove: [],
  turboTasksToRemove: [],
  dependsOnRN: true,
};
