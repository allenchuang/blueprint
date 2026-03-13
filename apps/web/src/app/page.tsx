"use client";

import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t("appName")}</h1>
      <p className="mt-4 text-lg text-gray-500">{t("mainWebApplication")}</p>
    </main>
  );
}
