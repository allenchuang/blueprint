import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Tag,
  User,
  Github,
  CheckCircle2,
  AlertCircle,
  Terminal,
} from "lucide-react";
import { loadRegistry } from "@/lib/registry";
import { StoreNav } from "@/components/store-nav";
import { StoreFooter } from "@/components/store-footer";
import { InstallButton } from "@/components/install-button";
import { CopyInline } from "@/components/copy-inline";
import { cn } from "@/lib/utils";
import type { PackageManifest } from "@/lib/registry";

// ── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  const { packages } = loadRegistry();
  return packages.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { packages } = loadRegistry();
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) return { title: "Package not found" };
  return {
    title: `${pkg.name} — BlueMart`,
    description: pkg.description,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<string, string> = {
  app:   "bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/20",
  agent: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
  skill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
};

const TYPE_LABELS: Record<string, string> = {
  app: "App", agent: "Agent", skill: "Skill",
};

/** Mock screenshot gradient palettes per type */
const SCREENSHOT_GRADIENTS = [
  "from-sky-500/20 via-violet-500/10 to-transparent",
  "from-emerald-500/20 via-sky-500/10 to-transparent",
  "from-violet-500/20 via-pink-500/10 to-transparent",
];

/** Per-package mock detail data (keyed by id, with a sensible fallback) */
interface PackageDetail {
  included: string[];
  requirements: { label: string; value: string }[];
  installSteps: string[];
  envVars: string[];
  port?: number;
}

function getDetail(pkg: PackageManifest): PackageDetail {
  const defaults: PackageDetail = {
    included: [
      `apps/${pkg.id}/ — Next.js app scaffold`,
      `packages/app-config — registry entry added`,
      `ecosystem.config.cjs — PM2 process entry`,
      `Caddy route for reverse proxy`,
    ],
    requirements: [
      { label: "Blueprint OS",  value: "≥ 0.1.0" },
      { label: "Node.js",       value: "≥ 23" },
      { label: "pnpm",          value: "10" },
    ],
    installSteps: [
      `Run \`blueprint install ${pkg.id}\` in your terminal`,
      "Blueprint CLI scaffolds the app and registers it in the OS",
      "Restart the OS: `pm2 restart os`",
      `Open at port ${pkg.id === "crm" ? 3006 : "assigned during install"}`,
    ],
    envVars: [],
  };

  // CRM gets richer mock data
  if (pkg.id === "crm") {
    return {
      included: [
        "apps/crm/ — full Next.js 15 app (port 3006)",
        "apps/crm/src/app/ — contacts, deals, and activity pages",
        "packages/db — contacts + deals schema migration",
        "packages/app-config — CRM registry entry",
        "ecosystem.config.cjs — PM2 crm process",
        "Caddy route: crm.yourdomain.com",
      ],
      requirements: [
        { label: "Blueprint OS",  value: "≥ 0.1.0" },
        { label: "Node.js",       value: "≥ 23" },
        { label: "pnpm",          value: "10" },
        { label: "PostgreSQL",    value: "via Neon (DATABASE_URL)" },
      ],
      installSteps: [
        "Run `blueprint install crm` in your terminal",
        "Blueprint CLI scaffolds the app and runs `pnpm db:push` to create tables",
        "Add `DATABASE_URL` to `.env` if not already set",
        "Restart the OS: `pm2 restart all`",
        "Open Blueprint OS → CRM window (port 3006)",
      ],
      envVars: ["DATABASE_URL"],
      port: 3006,
    };
  }

  return defaults;
}

const VERSION_HISTORY = [
  { version: "1.2.0", date: "2026-03-15", note: "Improved search, new deal pipeline view" },
  { version: "1.1.0", date: "2026-02-10", note: "Activity feed + mobile layout" },
  { version: "0.1.0", date: "2026-01-01", note: "Initial release" },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { packages } = loadRegistry();
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) notFound();

  const cmd    = pkg.installCommand ?? `blueprint install ${pkg.id}`;
  const detail = getDetail(pkg);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreNav />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

          {/* ── Back ──────────────────────────────────────────────── */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Back to BlueMart
          </Link>

          {/* ── Two-column layout ────────────────────────────────── */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">

            {/* ── Main column ───────────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col gap-10">

              {/* Header */}
              <section className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
                    style={{
                      backgroundColor: `${pkg.color ?? "#38BDF8"}18`,
                      border: `1px solid ${pkg.color ?? "#38BDF8"}30`,
                    }}
                  >
                    {pkg.icon ?? "📦"}
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-foreground">
                        {pkg.name}
                      </h1>
                      <span className="rounded border border-border px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                        v{pkg.version}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                          TYPE_STYLES[pkg.type] ?? "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {TYPE_LABELS[pkg.type] ?? pkg.type}
                      </span>
                    </div>
                    {pkg.author && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        by {pkg.author}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed">
                  {pkg.description}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  {pkg.downloads !== undefined && (
                    <span className="flex items-center gap-1">
                      <Download size={12} />
                      {pkg.downloads.toLocaleString()} installs
                    </span>
                  )}
                  {detail.port && (
                    <span className="flex items-center gap-1">
                      <Terminal size={12} />
                      Port {detail.port}
                    </span>
                  )}
                  {pkg.tags && pkg.tags.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Tag size={12} />
                      {pkg.tags.join(", ")}
                    </span>
                  )}
                  {pkg.author && (
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {pkg.author}
                    </span>
                  )}
                </div>

                {/* Install command block — visible on mobile, hidden on desktop (sidebar has it) */}
                <div className="lg:hidden flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
                    <code className="install-cmd text-primary text-sm">{cmd}</code>
                    <CopyInline text={cmd} />
                  </div>
                  <InstallButton command={cmd} />
                </div>
              </section>

              {/* Screenshots */}
              <section className="flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">Preview</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {SCREENSHOT_GRADIENTS.map((gradient, i) => (
                    <div
                      key={i}
                      className={cn(
                        "relative flex aspect-video items-center justify-center rounded-xl",
                        "border border-border bg-gradient-to-br overflow-hidden",
                        gradient,
                      )}
                    >
                      <div className="flex flex-col items-center gap-1.5 text-center px-3">
                        <span className="text-2xl opacity-40">🖼️</span>
                        <span className="text-[11px] text-muted-foreground/60">
                          Preview coming soon
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* What's included */}
              <section className="flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">
                  What&apos;s included
                </h2>
                <ul className="flex flex-col gap-2">
                  {detail.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400"
                      />
                      <code className="install-cmd text-[12px] text-foreground/80">
                        {item}
                      </code>
                    </li>
                  ))}
                </ul>

                {/* Env vars */}
                {detail.envVars.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Environment variables required
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {detail.envVars.map((v) => (
                        <span
                          key={v}
                          className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] text-amber-600 dark:text-amber-400"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Requirements */}
              <section className="flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">Requirements</h2>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  {detail.requirements.map((req, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 text-sm",
                        i < detail.requirements.length - 1 && "border-b border-border",
                      )}
                    >
                      <span className="text-muted-foreground">{req.label}</span>
                      <span className="font-mono text-xs text-foreground/80 bg-muted px-2 py-0.5 rounded">
                        {req.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* How to install */}
              <section className="flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">How to install</h2>
                <ol className="flex flex-col gap-3">
                  {detail.installSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground leading-relaxed">
                        {step.includes("`") ? (
                          <>
                            {step.split(/(`[^`]+`)/).map((part, j) =>
                              part.startsWith("`") ? (
                                <code
                                  key={j}
                                  className="install-cmd rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground/90"
                                >
                                  {part.slice(1, -1)}
                                </code>
                              ) : (
                                part
                              ),
                            )}
                          </>
                        ) : (
                          step
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* About the author */}
              <section className="flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">About the author</h2>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl shrink-0">
                    🧢
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground capitalize">
                      {pkg.author ?? "Blueprint team"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Building Blueprint OS in public
                    </p>
                  </div>
                  <a
                    href="https://github.com/allenchuang/blueprint"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground shrink-0"
                  >
                    <Github size={12} />
                    GitHub
                  </a>
                </div>
              </section>

            </div>{/* end main column */}

            {/* ── Sidebar (desktop only) ────────────────────────── */}
            <aside className="hidden lg:flex lg:w-72 lg:shrink-0 flex-col gap-5 lg:sticky lg:top-24">

              {/* Install card */}
              <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                    Install command
                  </p>
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 border border-border px-3 py-2">
                    <code className="install-cmd flex-1 text-primary text-[12px]">{cmd}</code>
                    <CopyInline text={cmd} />
                  </div>
                </div>
                <InstallButton command={cmd} />
                {detail.port && (
                  <p className="text-[11px] text-center text-muted-foreground/60">
                    Runs on port <strong className="text-muted-foreground">{detail.port}</strong>
                  </p>
                )}
              </div>

              {/* Quick stats */}
              <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                  Package info
                </p>
                {[
                  { label: "Version", value: `v${pkg.version}` },
                  { label: "Type",    value: TYPE_LABELS[pkg.type] ?? pkg.type },
                  { label: "License", value: "MIT" },
                  ...(pkg.downloads !== undefined
                    ? [{ label: "Installs", value: pkg.downloads.toLocaleString() }]
                    : []),
                  ...(pkg.updatedAt
                    ? [{ label: "Updated", value: pkg.updatedAt }]
                    : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground/80 font-mono text-xs bg-muted px-2 py-0.5 rounded">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Version history */}
              <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                  Version history
                </p>
                <div className="flex flex-col gap-2">
                  {VERSION_HISTORY.map((v, i) => (
                    <div key={v.version} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-foreground/80">{v.version}</span>
                        <span className="text-[10px] text-muted-foreground/60">{v.date}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/70">{v.note}</p>
                      {i < VERSION_HISTORY.length - 1 && (
                        <div className="mt-1 border-b border-border/50" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-500/70" />
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                  Blueprint CLI is in early access. Always review scaffolded files before running in production.
                </p>
              </div>

            </aside>

          </div>{/* end two-column */}

          {/* ── Mobile sidebar content (stacked below on small screens) ── */}
          <div className="mt-10 flex flex-col gap-5 lg:hidden">
            {/* Version history */}
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                Version history
              </p>
              <div className="flex flex-col gap-2">
                {VERSION_HISTORY.map((v, i) => (
                  <div key={v.version} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-foreground/80">{v.version}</span>
                      <span className="text-[10px] text-muted-foreground/60">{v.date}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/70">{v.note}</p>
                    {i < VERSION_HISTORY.length - 1 && (
                      <div className="mt-1 border-b border-border/50" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick info */}
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                Package info
              </p>
              {[
                { label: "Version", value: `v${pkg.version}` },
                { label: "Type",    value: TYPE_LABELS[pkg.type] ?? pkg.type },
                { label: "License", value: "MIT" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground/80 font-mono text-xs bg-muted px-2 py-0.5 rounded">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
