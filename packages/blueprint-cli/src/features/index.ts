export interface LayoutPatch {
  file: string;
  type: "remove-import" | "remove-wrapper" | "remove-block" | "remove-line";
  match: string;
  replacement?: string;
}

export interface FeatureManifest {
  id: string;
  name: string;
  description: string;
  category: "app" | "integration" | "web-feature";
  cliFlag: string;
  filesToRemove: string[];
  dirsToRemove: string[];
  depsToRemove: Record<string, string[]>;
  layoutPatches: LayoutPatch[];
  envKeysToRemove: string[];
  i18nKeysToRemove: string[];
  ruleFilesToRemove: string[];
  skillDirsToRemove: string[];
  rootScriptsToRemove: string[];
  turboTasksToRemove: string[];
  dependsOnRN?: boolean;
}

export type DatabaseProvider = "neon" | "supabase" | "pg" | "none";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
];

export interface FeatureSelections {
  apps: string[];
  auth: string;
  integrations: string[];
  webFeatures: string[];
  database: DatabaseProvider;
  languages: string[];
}

import { adminManifest } from "./apps/admin.js";
import { reactNativeManifest } from "./apps/react-native.js";
import { docsManifest } from "./apps/docs.js";
import { remotionManifest } from "./apps/remotion.js";
import { dynamicManifest } from "./integrations/dynamic.js";
import { privyManifest } from "./integrations/privy.js";
import { stripeManifest } from "./integrations/stripe.js";
import { elevenlabsManifest } from "./integrations/elevenlabs.js";
import { minikitManifest } from "./integrations/minikit.js";
import { analyticsManifest } from "./integrations/analytics.js";
import { i18nManifest } from "./web-features/i18n.js";
import { pwaManifest } from "./web-features/pwa.js";

export const APP_MANIFESTS: FeatureManifest[] = [
  adminManifest,
  reactNativeManifest,
  docsManifest,
  remotionManifest,
];

export const AUTH_MANIFESTS: FeatureManifest[] = [
  dynamicManifest,
  privyManifest,
];

export const INTEGRATION_MANIFESTS: FeatureManifest[] = [
  stripeManifest,
  elevenlabsManifest,
  minikitManifest,
  analyticsManifest,
];

export const WEB_FEATURE_MANIFESTS: FeatureManifest[] = [
  i18nManifest,
  pwaManifest,
];

export const ALL_MANIFESTS: FeatureManifest[] = [
  ...APP_MANIFESTS,
  ...AUTH_MANIFESTS,
  ...INTEGRATION_MANIFESTS,
  ...WEB_FEATURE_MANIFESTS,
];

export function getManifestsToStrip(
  selections: FeatureSelections,
  allManifests: FeatureManifest[] = ALL_MANIFESTS,
): FeatureManifest[] {
  const selectedIds = new Set([
    ...selections.apps,
    ...selections.integrations,
    ...selections.webFeatures,
  ]);
  if (selections.auth !== "none") {
    selectedIds.add(selections.auth);
  }
  return allManifests.filter((m) => !selectedIds.has(m.id));
}
