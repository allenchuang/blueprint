import { existsSync, readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import type { LanguageOption } from "../features/index.js";
import { LANGUAGE_OPTIONS } from "../features/index.js";

export function setupI18nLanguages(
  targetDir: string,
  selectedCodes: string[],
  mobileIncluded: boolean,
): void {
  const selected = selectedCodes
    .map((code) => LANGUAGE_OPTIONS.find((l) => l.code === code))
    .filter((l): l is LanguageOption => l != null);

  if (selected.length === 0) return;

  // Ensure English is always first
  if (!selected.some((l) => l.code === "en")) {
    const en = LANGUAGE_OPTIONS.find((l) => l.code === "en")!;
    selected.unshift(en);
  }

  // Write languages.json
  const languagesJson = {
    defaultLocale: "en",
    locales: selected.map((l) => ({
      code: l.code,
      name: l.name,
      nativeName: l.nativeName,
    })),
  };
  const languagesPath = join(targetDir, "packages/app-config/src/languages.json");
  writeFileSync(languagesPath, JSON.stringify(languagesJson, null, 2) + "\n");

  // Generate locale files and i18n configs for web
  const webLocaleDir = join(targetDir, "apps/web/src/i18n/locales");
  if (existsSync(webLocaleDir)) {
    generateLocaleFiles(webLocaleDir, selected);
    generateWebI18nConfig(join(targetDir, "apps/web/src/i18n/index.ts"), selected);
  }

  // Generate locale files and i18n configs for RN
  if (mobileIncluded) {
    const rnLocaleDir = join(targetDir, "apps/react-native/i18n/locales");
    if (existsSync(rnLocaleDir)) {
      generateLocaleFiles(rnLocaleDir, selected);
      generateRnI18nConfig(join(targetDir, "apps/react-native/i18n/index.ts"), selected);
    }
  }
}

function generateLocaleFiles(
  localeDir: string,
  languages: LanguageOption[],
): void {
  // Read en.json as the template
  const enPath = join(localeDir, "en.json");
  let enData: Record<string, string> = {};
  if (existsSync(enPath)) {
    enData = JSON.parse(readFileSync(enPath, "utf-8"));
  }

  // Remove locale files that aren't selected
  const selectedCodes = new Set(languages.map((l) => l.code));

  // For each selected language, ensure a locale file exists
  for (const lang of languages) {
    const localePath = join(localeDir, `${lang.code}.json`);
    if (lang.code === "en") continue;

    if (!existsSync(localePath)) {
      // Create with English values as placeholders
      writeFileSync(localePath, JSON.stringify(enData, null, 2) + "\n");
    }
  }

  // Remove locale files for unselected languages
  const existingFiles = readdirSync(localeDir).filter((f) => f.endsWith(".json"));
  for (const file of existingFiles) {
    const code = file.replace(".json", "");
    if (!selectedCodes.has(code)) {
      rmSync(join(localeDir, file));
    }
  }
}

function generateWebI18nConfig(
  configPath: string,
  languages: LanguageOption[],
): void {
  if (!existsSync(dirname(configPath))) return;

  const imports = languages
    .map((l) => `import ${l.code} from "./locales/${l.code}.json";`)
    .join("\n");

  const resources = languages
    .map((l) => `      ${l.code}: { translation: ${l.code} },`)
    .join("\n");

  const content = `import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import languages from "@repo/app-config/languages";

${imports}

const supportedLngs = languages.locales.map((l) => l.code);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs,
    fallbackLng: languages.defaultLocale,
    resources: {
${resources}
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
`;

  writeFileSync(configPath, content);
}

function generateRnI18nConfig(
  configPath: string,
  languages: LanguageOption[],
): void {
  if (!existsSync(dirname(configPath))) return;

  const imports = languages
    .map((l) => `import ${l.code} from "./locales/${l.code}.json";`)
    .join("\n");

  const resources = languages
    .map((l) => `      ${l.code}: { translation: ${l.code} },`)
    .join("\n");

  const content = `import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import languages from "@repo/app-config/languages";

${imports}

const supportedLngs = languages.locales.map((l) => l.code);

function getDeviceLanguage(): string {
  const deviceLocales = getLocales();
  const deviceLang = deviceLocales[0]?.languageCode ?? languages.defaultLocale;
  return supportedLngs.includes(deviceLang) ? deviceLang : languages.defaultLocale;
}

i18n.use(initReactI18next).init({
  lng: getDeviceLanguage(),
  supportedLngs,
  fallbackLng: languages.defaultLocale,
  resources: {
${resources}
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
`;

  writeFileSync(configPath, content);
}
