"use client";

import { Instrument_Serif } from "next/font/google";
import { appConfig } from "@repo/app-config";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

/* ── helpers ─────────────────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      aria-label={`Copy ${text}`}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
}

/* ── color data ──────────────────────────────────────────────────────── */

const LIGHT_TOKENS = [
  { name: "background", value: "oklch(1 0 0)", hex: "#ffffff" },
  { name: "foreground", value: "oklch(0.145 0 0)", hex: "#1c1c1c" },
  { name: "primary", value: "oklch(0.754 0.139 232.661)", hex: "#38BDF8" },
  { name: "primary-foreground", value: "oklch(0.205 0 0)", hex: "#2b2b2b" },
  { name: "secondary", value: "oklch(0.97 0 0)", hex: "#f5f5f5" },
  { name: "muted", value: "oklch(0.97 0 0)", hex: "#f5f5f5" },
  { name: "muted-foreground", value: "oklch(0.556 0 0)", hex: "#787878" },
  { name: "accent", value: "oklch(0.95 0.042 232.661)", hex: "#e0f2fe" },
  { name: "destructive", value: "oklch(0.577 0.245 27.325)", hex: "#dc2626" },
  { name: "border", value: "oklch(0.922 0 0)", hex: "#e5e5e5" },
  { name: "card", value: "oklch(1 0 0)", hex: "#ffffff" },
  { name: "ring", value: "oklch(0.754 0.139 232.661)", hex: "#38BDF8" },
];

const DARK_TOKENS = [
  { name: "background", value: "oklch(0.145 0 0)", hex: "#1c1c1c" },
  { name: "foreground", value: "oklch(0.985 0 0)", hex: "#fafafa" },
  { name: "primary", value: "oklch(0.85 0.139 232.661)", hex: "#7dd3fc" },
  { name: "primary-foreground", value: "oklch(0.205 0 0)", hex: "#2b2b2b" },
  { name: "secondary", value: "oklch(0.269 0 0)", hex: "#3a3a3a" },
  { name: "muted", value: "oklch(0.269 0 0)", hex: "#3a3a3a" },
  { name: "muted-foreground", value: "oklch(0.708 0 0)", hex: "#a3a3a3" },
  { name: "accent", value: "oklch(0.3 0.069 232.661)", hex: "#1e3a5f" },
  { name: "destructive", value: "oklch(0.704 0.191 22.216)", hex: "#ef4444" },
  { name: "border", value: "oklch(1 0 0 / 10%)", hex: "rgba(255,255,255,0.1)" },
  { name: "card", value: "oklch(0.205 0 0)", hex: "#2b2b2b" },
  { name: "ring", value: "oklch(0.85 0.139 232.661)", hex: "#7dd3fc" },
];

const CHART_TOKENS = [
  { name: "chart-1", light: "oklch(0.754 0.139 232.661)", dark: "oklch(0.85 0.139 232.661)", desc: "Primary (sky)" },
  { name: "chart-2", light: "oklch(0.6 0.15 292.661)", dark: "oklch(0.65 0.17 292.661)", desc: "Purple" },
  { name: "chart-3", light: "oklch(0.5 0.12 352.661)", dark: "oklch(0.7 0.15 352.661)", desc: "Rose" },
  { name: "chart-4", light: "oklch(0.7 0.16 52.661)", dark: "oklch(0.6 0.2 52.661)", desc: "Amber" },
  { name: "chart-5", light: "oklch(0.65 0.18 112.661)", dark: "oklch(0.65 0.22 112.661)", desc: "Green" },
];

/* ── color swatch ────────────────────────────────────────────────────── */

function ColorSwatch({ name, value, hex }: { name: string; value: string; hex: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-3">
      <div className="size-10 shrink-0 rounded-md border border-border/30 shadow-sm" style={{ background: hex }} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground font-mono truncate">{value}</p>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

/* ── section wrapper ─────────────────────────────────────────────────── */

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`${className}`}>
      <h2 className={`text-3xl md:text-4xl mb-8 ${instrumentSerif.className}`}>{title}</h2>
      {children}
    </section>
  );
}

/* ── perspective grid (same as landing) ──────────────────────────────── */

function PerspectiveGrid() {
  const cols = 20;
  const rows = 12;
  const cellSize = 120;
  const w = cols * cellSize;
  const h = rows * cellSize;
  const hLines = Array.from({ length: rows + 1 }, (_, i) => i * cellSize);
  const vLines = Array.from({ length: cols + 1 }, (_, i) => i * cellSize);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 h-[40%] overflow-hidden z-0" style={{ perspective: "800px" }}>
      <div className="absolute inset-0 origin-bottom" style={{ transform: "rotateX(55deg)" }}>
        <svg viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute -inset-x-[20%] bottom-0 h-full w-[140%]">
          <defs>
            <linearGradient id="brandGridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="35%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="brandGridMask">
              <rect width={w} height={h} fill="white" />
              <rect width={w} height={h} fill="url(#brandGridFade)" />
            </mask>
          </defs>
          <g mask="url(#brandGridMask)">
            {hLines.map((y, i) => (
              <line key={`h-${i}`} x1={0} y1={y} x2={w} y2={y} stroke="#3b82f6" strokeWidth="1.2" opacity={0.15} />
            ))}
            {vLines.map((x, i) => (
              <line key={`v-${i}`} x1={x} y1={0} x2={x} y2={h} stroke="#3b82f6" strokeWidth="1.2" opacity={0.15} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────────── */

export default function BrandGuidePage() {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-blue-300 via-blue-50/50 to-white dark:from-blue-950 dark:via-gray-900/50 dark:to-gray-950">
      <PerspectiveGrid />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/* Hero */}
        <header className="mb-20">
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">Brand Guide</p>
          <h1 className={`text-6xl md:text-8xl leading-none ${instrumentSerif.className}`}>
            {appConfig.name}
          </h1>
          <p className={`mt-4 text-2xl md:text-3xl text-muted-foreground ${instrumentSerif.className}`}>
            {appConfig.slogan}
          </p>
          <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
            A comprehensive guide to the {appConfig.name} visual identity. Everything here is derived from the design system and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">@repo/app-config</code>.
          </p>
        </header>

        <div className="space-y-20">
          {/* ── Typography ────────────────────────────────────────── */}
          <Section title="Typography">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Display Font</p>
                <p className={`text-5xl md:text-6xl leading-tight ${instrumentSerif.className}`}>
                  {appConfig.design.fonts.heading}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Weight 400 · Google Fonts · Used for all headlines, prices, and display text
                </p>
                <div className="mt-6 space-y-2 border-t border-border/50 pt-6">
                  <p className={`text-5xl ${instrumentSerif.className}`}>Aa</p>
                  <p className={`text-3xl ${instrumentSerif.className}`}>The quick brown fox</p>
                  <p className={`text-xl text-muted-foreground ${instrumentSerif.className}`}>jumps over the lazy dog</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Body Font</p>
                <p className="text-3xl md:text-4xl leading-tight font-light">
                  System Sans
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  system-ui stack · Used for body text, labels, and UI elements
                </p>
                <div className="mt-6 space-y-3 border-t border-border/50 pt-6 text-sm">
                  <p className="font-light">Light — {appConfig.description}</p>
                  <p className="font-normal">Regular — {appConfig.description}</p>
                  <p className="font-medium">Medium — {appConfig.description}</p>
                  <p className="font-semibold">Semibold — {appConfig.description}</p>
                  <p className="font-bold">Bold — {appConfig.description}</p>
                </div>
              </div>
            </div>

            {/* Type scale */}
            <div className="mt-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">Type Scale</p>
              <div className="space-y-4">
                {[
                  { label: "8xl", size: "text-8xl", sample: "Display" },
                  { label: "6xl", size: "text-6xl", sample: "Hero Heading" },
                  { label: "5xl", size: "text-5xl", sample: "Page Title" },
                  { label: "3xl", size: "text-3xl", sample: "Section Title" },
                  { label: "2xl", size: "text-2xl", sample: "Card Heading" },
                  { label: "xl", size: "text-xl", sample: "Subheading" },
                  { label: "base", size: "text-base", sample: "Body text — the quick brown fox jumps over the lazy dog" },
                  { label: "sm", size: "text-sm", sample: "Small text — labels, captions, helper text" },
                  { label: "xs", size: "text-xs", sample: "Extra small — badges, fine print" },
                ].map(({ label, size, sample }) => (
                  <div key={label} className="flex items-baseline gap-4 border-b border-border/30 pb-3 last:border-0">
                    <span className="w-12 shrink-0 text-xs font-mono text-muted-foreground">{label}</span>
                    <span className={`${size} ${["8xl", "6xl", "5xl", "3xl", "2xl"].includes(label) ? instrumentSerif.className : ""} leading-tight truncate`}>
                      {sample}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── Primary Color ─────────────────────────────────────── */}
          <Section title="Primary Color">
            <div className="rounded-2xl border border-border/50 overflow-hidden">
              <div className="h-32 md:h-40" style={{ background: appConfig.colors.primary }} />
              <div className="bg-card/50 backdrop-blur-sm p-6 flex flex-wrap items-center gap-x-8 gap-y-2">
                <div>
                  <p className="text-sm font-medium">Primary</p>
                  <p className="text-xs text-muted-foreground font-mono">{appConfig.colors.primary}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Light OKLCH</p>
                  <p className="text-xs font-mono">oklch(0.754 0.139 232.661)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dark OKLCH</p>
                  <p className="text-xs font-mono">oklch(0.85 0.139 232.661)</p>
                </div>
                <CopyButton text={appConfig.colors.primary} />
              </div>
            </div>
          </Section>

          {/* ── Light Mode Palette ────────────────────────────────── */}
          <Section title="Light Mode Tokens">
            <p className="text-muted-foreground mb-6">
              OKLCH color tokens defined in <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">theme.css</code> under <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">:root</code>.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LIGHT_TOKENS.map((t) => (
                <ColorSwatch key={t.name} {...t} />
              ))}
            </div>
          </Section>

          {/* ── Dark Mode Palette ─────────────────────────────────── */}
          <Section title="Dark Mode Tokens">
            <p className="text-muted-foreground mb-6">
              Tokens under the <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">.dark</code> selector. The app defaults to <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{appConfig.design.defaultTheme}</code> theme.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DARK_TOKENS.map((t) => (
                <ColorSwatch key={t.name} {...t} />
              ))}
            </div>
          </Section>

          {/* ── Chart Colors ──────────────────────────────────────── */}
          <Section title="Chart Palette">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CHART_TOKENS.map((t) => (
                <div key={t.name} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-3">
                  <div className="flex gap-1 shrink-0">
                    <div className="size-5 rounded" style={{ background: t.light }} title="Light" />
                    <div className="size-5 rounded" style={{ background: t.dark }} title="Dark" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Component Examples ─────────────────────────────────── */}
          <Section title="Components">
            <p className="text-muted-foreground mb-6">
              Real shadcn/ui components using the theme tokens. These look identical to production.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Buttons */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">Buttons</p>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Cards */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">Card</p>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className={`text-xl ${instrumentSerif.className}`}>Card Title</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cards use <code className="text-xs font-mono">bg-card</code> and <code className="text-xs font-mono">border-border</code> tokens for automatic theme switching.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">Action</Button>
                </div>
              </div>

              {/* Badges & Pills */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">Badges</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Primary</span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Secondary</span>
                  <span className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">Destructive</span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Muted</span>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">Outline</span>
                </div>
              </div>

              {/* Glassmorphism */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">Glass Effect</p>
                <div className="rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-black/8 dark:border-white/8 p-6">
                  <h3 className={`text-xl ${instrumentSerif.className}`}>Frosted Glass</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Used throughout the app for pricing cards, feature sections, and overlays.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Design Principles ─────────────────────────────────── */}
          <Section title="Design Principles">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Dark-First",
                  desc: "Design for dark mode first, then adapt for light. The dark palette is the hero aesthetic — deep blues, subtle gradients, frosted glass.",
                },
                {
                  title: "OKLCH Tokens",
                  desc: "All colors use OKLCH for perceptual uniformity. Generated by sync-config from the primary hex. Never hardcode colors — use semantic tokens.",
                },
                {
                  title: "Instrument Serif",
                  desc: "Headlines use Instrument Serif at weight 400 for an elegant, editorial feel. Body text uses the system font stack for crisp readability.",
                },
              ].map((p) => (
                <div key={p.title} className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className={`text-xl mb-2 ${instrumentSerif.className}`}>{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Config Reference ──────────────────────────────────── */}
          <Section title="App Config Reference">
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <pre className="p-6 text-sm font-mono overflow-x-auto leading-relaxed">
                <code>{JSON.stringify({
                  name: appConfig.name,
                  slug: appConfig.slug,
                  description: appConfig.description,
                  slogan: appConfig.slogan,
                  version: appConfig.version,
                  colors: appConfig.colors,
                  design: appConfig.design,
                }, null, 2)}</code>
              </pre>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Source: <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">packages/app-config/src/config.ts</code> — the single source of truth for all brand values.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>{appConfig.name} Brand Guide · v{appConfig.version}</p>
        </footer>
      </div>
    </div>
  );
}
