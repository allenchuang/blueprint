"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessagesSquare,
  DollarSign,
  Gauge,
  Brain,
  FolderOpen,
  Radio,
  ScrollText,
  Clock,
  Settings,
  Bot,
} from "lucide-react";

const navSections = [
  {
    label: "Control",
    items: [
      { href: "/agents", label: "Agents", icon: Bot },
    ],
  },
  {
    label: "Monitor",
    items: [
      { href: "/", label: "Overview", icon: LayoutDashboard },
      { href: "/sessions", label: "Sessions", icon: MessagesSquare },
      { href: "/costs", label: "Costs", icon: DollarSign },
      { href: "/rate-limits", label: "Rate Limits", icon: Gauge },
    ],
  },
  {
    label: "Workspace",
    items: [
      { href: "/memory", label: "Memory", icon: Brain },
      { href: "/files", label: "Files", icon: FolderOpen },
      { href: "/live-feed", label: "Live Feed", icon: Radio },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/logs", label: "Logs", icon: ScrollText },
      { href: "/cron", label: "Cron Jobs", icon: Clock },
      { href: "/config", label: "Config", icon: Settings },
    ],
  },
];

// Bottom tabs: max 5 — the most essential sections
const bottomTabs = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/sessions", label: "Sessions", icon: MessagesSquare },
  { href: "/costs", label: "Costs", icon: DollarSign },
  { href: "/cron", label: "Cron", icon: Clock },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-60 shrink-0 h-full border-r border-sidebar-border bg-sidebar backdrop-blur-xl flex-col">
        <div className="h-14 flex items-center px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">
                🦞
              </span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
              ClawDash
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-2 mb-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors duration-150",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Gateway connected
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar — shown only on mobile */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-sidebar border-t border-sidebar-border flex items-stretch pb-safe"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {bottomTabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] transition-colors",
                isActive
                  ? "text-primary"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
              )}
            >
              <tab.icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-primary" : ""
                )}
              />
              <span className="text-[10px] font-medium leading-none">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
