import { ShoppingCart, Package } from "lucide-react";
import { appConfig } from "@repo/app-config";
import { loadRegistry } from "@/lib/registry";
import { StoreBrowser } from "@/components/store-browser";
import { StoreNav } from "@/components/store-nav";
import { StoreFooter } from "@/components/store-footer";

export default function StorePage() {
  const { packages } = loadRegistry();

  const appCount   = packages.filter((p) => p.type === "app").length;
  const agentCount = packages.filter((p) => p.type === "agent").length;
  const skillCount = packages.filter((p) => p.type === "skill").length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreNav />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background px-4 py-14 sm:py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            {/* Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <ShoppingCart
                size={32}
                className="text-primary shrink-0"
                strokeWidth={1.5}
              />
              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl text-foreground">
                BlueMart
              </h1>
            </div>

            <p className="mt-2 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              Install apps, agents, and skills into your{" "}
              <span className="text-foreground font-medium">{appConfig.name} OS</span>.
            </p>

            {/* Stats */}
            <div className="mt-8 flex items-center justify-center gap-8 sm:gap-12 text-sm">
              {[
                { label: "Apps",   count: appCount,   color: "text-sky-500 dark:text-sky-400" },
                { label: "Agents", count: agentCount, color: "text-violet-500 dark:text-violet-400" },
                { label: "Skills", count: skillCount, color: "text-emerald-500 dark:text-emerald-400" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span className={`text-2xl font-semibold tabular-nums ${color}`}>
                    {count}
                  </span>
                  <span className="text-xs text-muted-foreground/70 uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Install snippet */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                Install any package
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-5 py-3">
                <code className="install-cmd text-primary">
                  blueprint install &lt;package-id&gt;
                </code>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#browse"
                className="w-full sm:w-auto rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
              >
                Browse Packages
              </a>
              <a
                href="https://github.com/allenchuang/blueprint/blob/allen/os/registry/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border/80 hover:text-foreground"
              >
                <Package size={14} />
                Submit a Package
              </a>
            </div>
          </div>
        </section>

        {/* ── Package grid ─────────────────────────────────────────────── */}
        <section
          id="browse"
          className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
        >
          <StoreBrowser packages={packages} />
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
