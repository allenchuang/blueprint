"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PackageCard } from "@/components/package-card";
import type { PackageManifest } from "@/lib/registry";

type FilterType = "all" | "app" | "agent" | "skill";
type SortKey = "popular" | "newest" | "alpha";

interface StoreBrowserProps {
  packages: PackageManifest[];
}

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "All",    value: "all"   },
  { label: "Apps",   value: "app"   },
  { label: "Agents", value: "agent" },
  { label: "Skills", value: "skill" },
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Popular", value: "popular" },
  { label: "Newest",  value: "newest"  },
  { label: "A–Z",     value: "alpha"   },
];

export function StoreBrowser({ packages }: StoreBrowserProps) {
  const [query,  setQuery]  = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort,   setSort]   = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    let list = [...packages];

    if (filter !== "all") {
      list = list.filter((p) => p.type === filter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (sort === "popular") {
      list.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
    } else if (sort === "newest") {
      list.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [packages, query, filter, sort]);

  const counts = useMemo(
    () => ({
      all:   packages.length,
      app:   packages.filter((p) => p.type === "app").length,
      agent: packages.filter((p) => p.type === "agent").length,
      skill: packages.filter((p) => p.type === "skill").length,
    }),
    [packages],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search apps, agents, skills…"
          className={cn(
            "w-full rounded-xl border border-border bg-card py-3 pl-11 pr-10",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50",
            "transition-colors",
          )}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter + sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Type pills */}
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors border",
                filter === opt.value
                  ? "bg-primary/10 text-primary border-primary/25"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
              )}
            >
              {opt.label}
              <span className="ml-1.5 text-[11px] text-muted-foreground/60">
                {counts[opt.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground/60 mr-1">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                sort === opt.value
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground/60">
        {filtered.length === 0
          ? "No packages found"
          : `${filtered.length} package${filtered.length !== 1 ? "s" : ""}`}
        {query && ` for "${query}"`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <span className="text-4xl">📭</span>
          <p className="text-muted-foreground text-sm">No packages match your search.</p>
          <button
            onClick={() => { setQuery(""); setFilter("all"); }}
            className="text-xs text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
