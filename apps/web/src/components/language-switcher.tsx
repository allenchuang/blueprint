"use client";

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import languages from "@repo/app-config/languages";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("switchLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="min-w-[160px]">
        {languages.locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => i18n.changeLanguage(locale.code)}
            className={
              i18n.language === locale.code
                ? "bg-accent text-accent-foreground"
                : ""
            }
          >
            <span>{locale.nativeName}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {locale.code.toUpperCase()}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
