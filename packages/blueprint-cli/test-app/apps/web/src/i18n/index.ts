import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import languages from "@repo/app-config/languages";

import enCommon from "./locales/en/common.json";
import zhCommon from "./locales/zh/common.json";
import esCommon from "./locales/es/common.json";

const supportedLngs = languages.locales.map((l) => l.code);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs,
    fallbackLng: languages.defaultLocale,
    defaultNS: "common",
    ns: ["common"],
    resources: {
      en: { common: enCommon },
      zh: { common: zhCommon },
      es: { common: esCommon },
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
