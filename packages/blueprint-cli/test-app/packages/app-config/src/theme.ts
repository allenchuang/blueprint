import { parse, converter } from "culori";

const toOklch = converter("oklch");

function oklchString(color: ReturnType<typeof toOklch>): string {
  if (!color) return "oklch(0 0 0)";
  const l = round(color.l ?? 0);
  const c = round(color.c ?? 0);
  const h = round(color.h ?? 0);
  return `oklch(${l} ${c} ${h})`;
}

function round(n: number, decimals = 3): number {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

function adjustLightness(
  color: ReturnType<typeof toOklch>,
  lightness: number,
  chromaScale = 1,
): string {
  if (!color) return "oklch(0 0 0)";
  return oklchString({
    mode: "oklch",
    l: Math.max(0, Math.min(1, lightness)),
    c: (color.c ?? 0) * chromaScale,
    h: color.h ?? 0,
  });
}

function hueShift(
  color: ReturnType<typeof toOklch>,
  degrees: number,
  lightness?: number,
  chroma?: number,
): string {
  if (!color) return "oklch(0 0 0)";
  return oklchString({
    mode: "oklch",
    l: lightness ?? color.l ?? 0.5,
    c: chroma ?? color.c ?? 0.1,
    h: ((color.h ?? 0) + degrees) % 360,
  });
}

export interface ThemeCSS {
  light: string;
  dark: string;
  themeInline: string;
}

export function generateThemeCSS(primaryHex: string): ThemeCSS {
  const parsed = parse(primaryHex);
  if (!parsed) throw new Error(`Invalid color: ${primaryHex}`);
  const primary = toOklch(parsed);
  if (!primary) throw new Error(`Could not convert to OKLCH: ${primaryHex}`);

  const primaryL = primary.l ?? 0.5;
  const primaryFgLight =
    primaryL > 0.6 ? "oklch(0.205 0 0)" : "oklch(0.985 0 0)";
  const primaryFgDark =
    primaryL > 0.6 ? "oklch(0.205 0 0)" : "oklch(0.985 0 0)";

  const lightPrimary = oklchString(primary);
  const darkPrimary = adjustLightness(primary, Math.min(primaryL + 0.15, 0.85));

  const light = {
    "--radius": "0.625rem",
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--primary": lightPrimary,
    "--primary-foreground": primaryFgLight,
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
    "--accent": adjustLightness(primary, 0.95, 0.3),
    "--accent-foreground": "oklch(0.205 0 0)",
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(0.922 0 0)",
    "--input": "oklch(0.922 0 0)",
    "--ring": lightPrimary,
    "--chart-1": lightPrimary,
    "--chart-2": hueShift(primary, 60, 0.6, 0.15),
    "--chart-3": hueShift(primary, 120, 0.5, 0.12),
    "--chart-4": hueShift(primary, 180, 0.7, 0.16),
    "--chart-5": hueShift(primary, 240, 0.65, 0.18),
    "--sidebar": "oklch(0.985 0 0)",
    "--sidebar-foreground": "oklch(0.145 0 0)",
    "--sidebar-primary": lightPrimary,
    "--sidebar-primary-foreground": primaryFgLight,
    "--sidebar-accent": adjustLightness(primary, 0.95, 0.3),
    "--sidebar-accent-foreground": "oklch(0.205 0 0)",
    "--sidebar-border": "oklch(0.922 0 0)",
    "--sidebar-ring": lightPrimary,
  };

  const dark = {
    "--background": "oklch(0.145 0 0)",
    "--foreground": "oklch(0.985 0 0)",
    "--card": "oklch(0.205 0 0)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--popover": "oklch(0.269 0 0)",
    "--popover-foreground": "oklch(0.985 0 0)",
    "--primary": darkPrimary,
    "--primary-foreground": primaryFgDark,
    "--secondary": "oklch(0.269 0 0)",
    "--secondary-foreground": "oklch(0.985 0 0)",
    "--muted": "oklch(0.269 0 0)",
    "--muted-foreground": "oklch(0.708 0 0)",
    "--accent": adjustLightness(primary, 0.3, 0.5),
    "--accent-foreground": "oklch(0.985 0 0)",
    "--destructive": "oklch(0.704 0.191 22.216)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(1 0 0 / 10%)",
    "--input": "oklch(1 0 0 / 15%)",
    "--ring": darkPrimary,
    "--chart-1": darkPrimary,
    "--chart-2": hueShift(primary, 60, 0.65, 0.17),
    "--chart-3": hueShift(primary, 120, 0.7, 0.15),
    "--chart-4": hueShift(primary, 180, 0.6, 0.2),
    "--chart-5": hueShift(primary, 240, 0.65, 0.22),
    "--sidebar": "oklch(0.205 0 0)",
    "--sidebar-foreground": "oklch(0.985 0 0)",
    "--sidebar-primary": darkPrimary,
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.269 0 0)",
    "--sidebar-accent-foreground": "oklch(0.985 0 0)",
    "--sidebar-border": "oklch(1 0 0 / 10%)",
    "--sidebar-ring": darkPrimary,
  };

  const themeVarNames = [
    "background",
    "foreground",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "muted",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
    "border",
    "input",
    "ring",
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
    "sidebar",
    "sidebar-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
  ];

  return {
    light: formatVarBlock(":root", light),
    dark: formatVarBlock(".dark", dark),
    themeInline: formatThemeInline(themeVarNames),
  };
}

function formatVarBlock(
  selector: string,
  vars: Record<string, string>,
): string {
  const lines = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `${selector} {\n${lines}\n}`;
}

function formatThemeInline(varNames: string[]): string {
  const lines = varNames
    .map((name) => `  --color-${name}: var(--${name});`)
    .join("\n");
  return `@theme inline {\n  --radius: var(--radius);\n${lines}\n}`;
}

export function generateFullThemeFile(primaryHex: string): string {
  const { light, dark, themeInline } = generateThemeCSS(primaryHex);
  return `${light}\n\n${dark}\n\n${themeInline}\n`;
}
