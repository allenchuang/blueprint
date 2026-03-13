import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import languages from "@repo/app-config/languages";

import enCommon from "./locales/en/common.json";
import zhCommon from "./locales/zh/common.json";
import esCommon from "./locales/es/common.json";

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
});

export default i18n;
