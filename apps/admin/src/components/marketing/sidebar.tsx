"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Lightbulb, Globe2, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/", icon: BarChart3 },
  { label: "Strategies", href: "/strategies", icon: Lightbulb },
  { label: "Socials", href: "/socials", icon: Globe2 },
];



export function MarketingSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex w-52 flex-shrink-0 flex-col"
      style={{
        background: "rgba(28, 28, 30, 0.82)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Brand */}
      <div className="px-4 pt-5 pb-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(10,132,255,0.18)", boxShadow: "0 0 0 1px rgba(10,132,255,0.3)" }}
          >
            <Zap className="w-4 h-4 text-[#0a84ff]" />
          </div>
          <div>
            <p
              className="text-[13px] font-semibold leading-none"
              style={{ color: "#f5f5f7", letterSpacing: "-0.01em" }}
            >
              Blueprint OS
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "#636366" }}>
              Marketing
            </p>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 12px 8px" }} />

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5">
        <p
          className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "#636366", letterSpacing: "0.08em" }}
        >
          Analytics
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 min-h-[36px]",
                isActive
                  ? "text-white"
                  : "hover:text-white"
              )}
              style={
                isActive
                  ? {
                      background: "rgba(10,132,255,0.18)",
                      color: "#5ac8fa",
                      boxShadow: "inset 0 0 0 1px rgba(10,132,255,0.2)",
                    }
                  : { color: "#8e8e93" }
              }
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent";
              }}
            >
              <Icon className="w-[15px] h-[15px] flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 px-1.5 py-1">
          <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#30d158" }} />
          <span className="text-[11px]" style={{ color: "#636366" }}>
            +18.2% followers ↑
          </span>
        </div>
      </div>
    </aside>
  );
}

// Mobile bottom tab bar
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div className="bottom-tab-bar md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 flex-1 min-h-[44px] justify-center transition-all duration-150"
            >
              <Icon
                className="w-[22px] h-[22px]"
                style={{ color: isActive ? "#0a84ff" : "#636366" }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "#0a84ff" : "#636366" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
