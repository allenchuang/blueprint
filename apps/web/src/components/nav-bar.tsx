"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, Home } from "lucide-react";
import { CreditCard } from "lucide-react"; // stripe-nav-icon
import { Mic } from "lucide-react"; // elevenlabs-nav-icon
import { appConfig } from "@repo/app-config";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavAuth } from "@/components/nav-auth";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/pricing", labelKey: "stripeIntegration", icon: CreditCard },
  { href: "/voice-agent", labelKey: "elevenlabsVoice", icon: Mic },
];

export function NavBar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-9",
        "flex items-center gap-1 px-3",
        // "bg-white/60 dark:bg-black/40",
        "backdrop-blur-2xl",
        // "border-b border-black/8 dark:border-white/8",
      )}
    >
      {/* Mobile hamburger — far left */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className={cn(
              "md:hidden flex items-center justify-center w-7 h-7 rounded-md",
              "text-sky-800 dark:text-sky-200",
              "hover:bg-sky-100/60 dark:hover:bg-sky-400/10 transition-colors",
            )}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          showCloseButton={false}
          className={cn(
            "w-72 p-0",
            "bg-white/70 dark:bg-black/60",
            "backdrop-blur-2xl backdrop-saturate-150",
            "border-r border-black/8 dark:border-white/8",
          )}
        >
          {/* Drawer nav */}
          <nav className="px-3 pt-4 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    isActive
                      ? "bg-sky-200/70 dark:bg-sky-400/20 text-sky-900 dark:text-white font-medium"
                      : "text-sky-800/80 dark:text-sky-300/80 hover:bg-sky-100/70 dark:hover:bg-sky-400/10 hover:text-sky-900 dark:hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-70" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* App name — desktop only */}
      <Link
        href="/"
        className="hidden md:block shrink-0 px-2 py-1 text-[13px] font-semibold tracking-tight text-sky-900 dark:text-sky-100 select-none"
      >
        {appConfig.name}
      </Link>

      {/* Desktop nav items */}
      <nav className="hidden md:flex items-center gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1 rounded-md text-[13px] transition-all duration-100 select-none",
                isActive
                  ? "bg-sky-200/70 dark:bg-sky-400/20 text-sky-900 dark:text-white font-medium"
                  : "text-sky-800/75 dark:text-sky-300/80 hover:bg-sky-100/60 dark:hover:bg-sky-400/10 hover:text-sky-900 dark:hover:text-white",
              )}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-1.5">
        <NavAuth />
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
