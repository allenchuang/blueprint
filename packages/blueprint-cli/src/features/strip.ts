import { existsSync, rmSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { FeatureManifest, FeatureSelections } from "./index.js";
import { getManifestsToStrip } from "./index.js";
import { removeDeps, removeScripts, removeTurboTasks } from "../utils/patch-json.js";
import { patchFile, removeEnvKeys, removeI18nKeys, replaceI18nWithStrings } from "../utils/patch-file.js";
import { applyDatabaseSelection } from "./database/index.js";
import { cleanDocFiles } from "../utils/patch-docs.js";
import { setupI18nLanguages } from "../utils/setup-i18n.js";

const RULE_DIRS = [".cursor/rules", ".agents/rules", ".claude/rules"];
const SKILL_DIRS = [".cursor/skills", ".agents/skills", ".claude/skills"];

const ENV_EXAMPLE_FILES = [
  ".env.example",
  "apps/web/.env.example",
  "apps/server/.env.example",
  "apps/react-native/.env.example",
];

export function stripFeatures(
  targetDir: string,
  selections: FeatureSelections,
): void {
  const mobileIncluded = selections.apps.includes("mobile");
  const i18nIncluded = selections.webFeatures.includes("i18n");
  const manifests = getManifestsToStrip(selections);

  // Snapshot translations BEFORE stripping (i18n dir gets deleted during strip)
  let webTranslations: Record<string, string> = {};
  let rnTranslations: Record<string, string> = {};
  if (!i18nIncluded) {
    const webEnPath = join(targetDir, "apps/web/src/i18n/locales/en.json");
    if (existsSync(webEnPath)) {
      try { webTranslations = JSON.parse(readFileSync(webEnPath, "utf-8")); } catch {}
    }
    if (mobileIncluded) {
      const rnEnPath = join(targetDir, "apps/react-native/i18n/locales/en.json");
      if (existsSync(rnEnPath)) {
        try { rnTranslations = JSON.parse(readFileSync(rnEnPath, "utf-8")); } catch {}
      }
      if (Object.keys(rnTranslations).length === 0) {
        rnTranslations = webTranslations;
      }
    }
  }

  // Collect all env keys and i18n keys to remove across all manifests
  const allEnvKeys: string[] = [];
  const allI18nKeys: string[] = [];

  for (const manifest of manifests) {
    stripManifest(targetDir, manifest, mobileIncluded);
    allEnvKeys.push(...manifest.envKeysToRemove);
    allI18nKeys.push(...manifest.i18nKeysToRemove);
  }

  // Shared auth i18n keys — only remove when NO auth provider is selected
  if (selections.auth === "none") {
    allI18nKeys.push(
      "login",
      "logout",
      "loggedInAs",
      "authNotConfigured",
      "authNotConfiguredHint",
    );
  }

  // Batch-clean env example files
  if (allEnvKeys.length > 0) {
    for (const envFile of ENV_EXAMPLE_FILES) {
      const fullPath = join(targetDir, envFile);
      if (envFile.includes("react-native") && !mobileIncluded) continue;
      removeEnvKeys(fullPath, allEnvKeys);
    }
  }

  // Batch-clean i18n locale files
  if (allI18nKeys.length > 0 && i18nIncluded) {
    cleanI18nKeys(targetDir, allI18nKeys, mobileIncluded);
  }

  // If i18n was stripped, replace t() calls with static strings using pre-loaded translations
  if (!i18nIncluded) {
    inlineI18nStrings(targetDir, mobileIncluded, webTranslations, rnTranslations);
  }

  // If i18n is included, configure the selected languages
  if (i18nIncluded && selections.languages.length > 0) {
    setupI18nLanguages(targetDir, selections.languages, mobileIncluded);
  }

  // Apply database selection
  applyDatabaseSelection(targetDir, selections.database);

  // Clean documentation files (README, AGENTS.md, project-overview rule)
  cleanDocFiles(targetDir, selections);
}

function stripManifest(
  targetDir: string,
  manifest: FeatureManifest,
  mobileIncluded: boolean,
): void {
  // Remove files
  for (const file of manifest.filesToRemove) {
    if (!mobileIncluded && file.startsWith("apps/react-native/")) continue;
    const fullPath = join(targetDir, file);
    if (existsSync(fullPath)) {
      rmSync(fullPath, { force: true });
    }
  }

  // Remove directories
  for (const dir of manifest.dirsToRemove) {
    if (!mobileIncluded && dir.startsWith("apps/react-native/")) continue;
    const fullPath = join(targetDir, dir);
    if (existsSync(fullPath)) {
      rmSync(fullPath, { recursive: true, force: true });
    }
  }

  // Remove dependencies from package.json files
  for (const [pkgDir, deps] of Object.entries(manifest.depsToRemove)) {
    if (!mobileIncluded && pkgDir.includes("react-native")) continue;
    removeDeps(join(targetDir, pkgDir, "package.json"), deps);
  }

  // Apply layout patches
  for (const patch of manifest.layoutPatches) {
    if (!mobileIncluded && patch.file.includes("react-native")) continue;
    patchFile(join(targetDir, patch.file), [patch]);
  }

  // Remove rule files from all 3 directories
  for (const ruleFile of manifest.ruleFilesToRemove) {
    for (const ruleDir of RULE_DIRS) {
      const fullPath = join(targetDir, ruleDir, ruleFile);
      if (existsSync(fullPath)) rmSync(fullPath);
    }
  }

  // Remove skill directories from all 3 directories
  for (const skillDir of manifest.skillDirsToRemove) {
    for (const skillBase of SKILL_DIRS) {
      const fullPath = join(targetDir, skillBase, skillDir);
      if (existsSync(fullPath)) rmSync(fullPath, { recursive: true, force: true });
    }
  }

  // Remove root scripts
  if (manifest.rootScriptsToRemove.length > 0) {
    removeScripts(join(targetDir, "package.json"), manifest.rootScriptsToRemove);
  }

  // Remove turbo tasks
  if (manifest.turboTasksToRemove.length > 0) {
    removeTurboTasks(join(targetDir, "turbo.json"), manifest.turboTasksToRemove);
  }
}

function cleanI18nKeys(
  targetDir: string,
  keys: string[],
  mobileIncluded: boolean,
): void {
  const localeDirs = [
    join(targetDir, "apps/web/src/i18n/locales"),
    ...(mobileIncluded ? [join(targetDir, "apps/react-native/i18n/locales")] : []),
  ];

  for (const localeDir of localeDirs) {
    if (!existsSync(localeDir)) continue;
    const files = readdirSync(localeDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      removeI18nKeys(join(localeDir, file), keys);
    }
  }
}

function inlineI18nStrings(
  targetDir: string,
  mobileIncluded: boolean,
  webTranslations: Record<string, string>,
  rnTranslations: Record<string, string>,
): void {
  // Replace t() calls in web app .tsx files
  const webSrcDir = join(targetDir, "apps/web/src");
  if (existsSync(webSrcDir)) {
    const tsxFiles = findFiles(webSrcDir, ".tsx");
    for (const file of tsxFiles) {
      const content = readFileSync(file, "utf-8");
      if (content.includes("useTranslation") || content.includes('from "react-i18next"')) {
        replaceI18nWithStrings(file, webTranslations);
      }
    }
  }

  // Replace t() calls in RN app .tsx files
  if (mobileIncluded) {
    const rnAppDir = join(targetDir, "apps/react-native");
    if (existsSync(rnAppDir)) {
      const tsxFiles = findFiles(rnAppDir, ".tsx");
      for (const file of tsxFiles) {
        if (file.includes("node_modules")) continue;
        const content = readFileSync(file, "utf-8");
        if (content.includes("useTranslation") || content.includes('from "react-i18next"')) {
          replaceI18nWithStrings(file, rnTranslations);
        }
      }
    }
  }
}

function findFiles(dir: string, extension: string): string[] {
  const results: string[] = [];

  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
      results.push(...findFiles(fullPath, extension));
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      results.push(fullPath);
    }
  }

  return results;
}
