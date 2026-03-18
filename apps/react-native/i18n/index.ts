import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import languages from "@repo/app-config/languages";

import en from "./locales/en.json";
import zh from "./locales/zh.json";
import es from "./locales/es.json";

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
    en: { translation: en },
    zh: { translation: zh },
    es: { translation: es },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
