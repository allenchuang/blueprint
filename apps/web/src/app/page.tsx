"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { AuthDemo } from "@/components/auth-demo";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t("appName")}</h1>
      <p className="mt-4 text-lg text-gray-500">{t("mainWebApplication")}</p>
      <div className="mt-8 flex gap-3">
        <Link href="/pricing">
          <Button variant="outline">{t("pricing")}</Button>
        </Link>
        <Link href="/voice-agent">
          <Button variant="outline">{t("voiceAgent")}</Button>
        </Link>
      </div>
      <div className="mt-8 w-full max-w-sm">
        <AuthDemo />
      </div>
    </main>
  );
}
