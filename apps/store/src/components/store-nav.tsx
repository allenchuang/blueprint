"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { appConfig } from "@repo/app-config";
import { ThemeToggle } from "@/components/theme-toggle";

export function StoreNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-lg">🧢</span>
          <span className="text-sm font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {appConfig.name}
          </span>
          <span className="text-muted-foreground/50 text-sm hidden sm:block">/</span>
          <span className="hidden sm:block text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            BlueMart
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/allenchuang/blueprint/blob/allen/os/registry/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-border/80 hover:text-foreground hover:bg-muted"
          >
            <Package size={12} />
            <span className="hidden sm:inline">Submit a Package</span>
            <span className="sm:hidden">Submit</span>
          </a>
        </div>
      </div>
    </header>
  );
}
