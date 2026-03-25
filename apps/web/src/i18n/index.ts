import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import languages from "@repo/app-config/languages";

import en from "./locales/en.json";
import zh from "./locales/zh.json";
import es from "./locales/es.json";

const supportedLngs = languages.locales.map((l) => l.code);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs,
    fallbackLng: languages.defaultLocale,
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      es: { translation: es },
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
