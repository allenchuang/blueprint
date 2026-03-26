"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Lightbulb,
  Globe2,
  Home,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Overview",
    href: "/marketing",
    icon: BarChart3,
  },
  {
    label: "Strategies",
    href: "/marketing/strategies",
    icon: Lightbulb,
  },
  {
    label: "Socials",
    href: "/marketing/socials",
    icon: Globe2,
  },
];

export function MarketingSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 border-r border-border bg-sidebar flex flex-col">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground leading-none">
              Blueprint OS
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Marketing
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Analytics
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/marketing"
              ? pathname === "/marketing"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          Admin Home
        </Link>
        <div className="mt-3 px-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] text-muted-foreground">
              +18.2% followers this month
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
