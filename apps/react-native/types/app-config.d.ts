declare module "@repo/app-config/languages" {
  interface Locale {
    code: string;
    name: string;
    nativeName: string;
  }

  interface Languages {
    defaultLocale: string;
    locales: Locale[];
  }

  const languages: Languages;
  export default languages;
}
