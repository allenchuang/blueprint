"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PackageManifest } from "@/lib/registry";

const TYPE_STYLES: Record<string, string> = {
  app:   "bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/20",
  agent: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
  skill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
};

const TYPE_LABELS: Record<string, string> = {
  app:   "App",
  agent: "Agent",
  skill: "Skill",
};

interface PackageCardProps {
  pkg: PackageManifest;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const [copied, setCopied] = useState(false);
  const cmd = pkg.installCommand ?? `blueprint install ${pkg.id}`;

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault(); // don't follow the card link
    await navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Link href={`/packages/${pkg.id}`} className="block">
      <article
        className={cn(
          "package-card group relative flex flex-col gap-4 rounded-xl",
          "border border-border bg-card p-5 h-full",
          "hover:border-border/80 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30",
        )}
      >
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Colored icon */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl"
            style={{
              backgroundColor: `${pkg.color ?? "#38BDF8"}18`,
              border: `1px solid ${pkg.color ?? "#38BDF8"}30`,
            }}
          >
            {pkg.icon ?? "📦"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="truncate text-sm font-semibold text-card-foreground">
                {pkg.name}
              </span>
              <span className="rounded px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border">
                v{pkg.version}
              </span>
            </div>
            {pkg.author && (
              <p className="mt-0.5 text-xs text-muted-foreground/70">
                by {pkg.author}
              </p>
            )}
          </div>

          {/* Type badge */}
          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              TYPE_STYLES[pkg.type] ?? "bg-muted text-muted-foreground border-border",
            )}
          >
            {TYPE_LABELS[pkg.type] ?? pkg.type}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {pkg.description}
        </p>

        {/* Tags */}
        {pkg.tags && pkg.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {pkg.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: install command + downloads */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 border border-border px-3 py-2">
            <code className="install-cmd flex-1 truncate text-primary">
              {cmd}
            </code>
            <button
              onClick={handleCopy}
              aria-label="Copy install command"
              className={cn(
                "shrink-0 rounded p-1 transition-colors",
                copied
                  ? "text-emerald-500"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          {pkg.downloads !== undefined && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
              <Download size={11} />
              <span>{pkg.downloads.toLocaleString()} installs</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
