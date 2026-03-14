import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { appConfig } from "../src/config.js";
import { generateFullThemeFile } from "../src/theme.js";
import { generateOgPng } from "../src/og.js";
import { parse, converter, formatHex } from "culori";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../..");
const ASSETS_DIR = resolve(__dirname, "../assets");

const toOklch = converter("oklch");

function lightenHex(hex: string, amount: number): string {
  const parsed = parse(hex);
  if (!parsed) return hex;
  const oklch = toOklch(parsed);
  if (!oklch) return hex;
  oklch.l = Math.min(1, (oklch.l ?? 0.5) + amount);
  return formatHex(oklch) ?? hex;
}

function patchJson(filePath: string, patcher: (data: Record<string, unknown>) => void): void {
  const abs = resolve(ROOT, filePath);
  const raw = readFileSync(abs, "utf-8");
  const data = JSON.parse(raw) as Record<string, unknown>;
  patcher(data);
  writeFileSync(abs, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`  Patched ${filePath}`);
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function copyAsset(srcName: string, destPath: string): void {
  const src = resolve(ASSETS_DIR, srcName);
  const dest = resolve(ROOT, destPath);
  if (!existsSync(src)) {
    console.warn(`  Warning: asset not found: ${srcName} — skipping`);
    return;
  }
  ensureDir(dirname(dest));
  copyFileSync(src, dest);
  console.log(`  Copied ${srcName} -> ${destPath}`);
}

function writeFile(filePath: string, content: string): void {
  const abs = resolve(ROOT, filePath);
  ensureDir(dirname(abs));
  writeFileSync(abs, content, "utf-8");
  console.log(`  Generated ${filePath}`);
}

// ---------------------------------------------------------------------------
// 1. Sync React Native app.json
// ---------------------------------------------------------------------------
function syncReactNative(): void {
  console.log("\n[React Native] Syncing app.json + assets...");

  patchJson("apps/react-native/app.json", (data) => {
    const expo = data["expo"] as Record<string, unknown>;
    expo["name"] = appConfig.name;
    expo["slug"] = appConfig.slug;
    expo["version"] = appConfig.version;
    expo["scheme"] = appConfig.mobile.scheme;

    const splash = expo["splash"] as Record<string, unknown>;
    splash["backgroundColor"] = appConfig.colors.primary;

    const ios = expo["ios"] as Record<string, unknown>;
    ios["bundleIdentifier"] = appConfig.mobile.bundleId;

    const android = expo["android"] as Record<string, unknown>;
    android["package"] = appConfig.mobile.bundleId;
    const adaptiveIcon = android["adaptiveIcon"] as Record<string, unknown>;
    adaptiveIcon["backgroundColor"] = appConfig.colors.primary;
  });

  copyAsset("icon-512.png", "apps/react-native/assets/icon.png");
  copyAsset("icon-512.png", "apps/react-native/assets/adaptive-icon.png");
  copyAsset("splash.png", "apps/react-native/assets/splash-icon.png");
}

// ---------------------------------------------------------------------------
// 2. Sync Mintlify docs mint.json + assets
// ---------------------------------------------------------------------------
function syncDocs(): void {
  console.log("\n[Docs] Syncing mint.json + assets...");

  const lightVariant = lightenHex(appConfig.colors.primary, 0.15);

  patchJson("apps/docs/mint.json", (data) => {
    data["name"] = appConfig.name;

    const colors = data["colors"] as Record<string, unknown>;
    colors["primary"] = appConfig.colors.primary;
    colors["light"] = lightVariant;
    colors["dark"] = appConfig.colors.primary;
    const anchors = colors["anchors"] as Record<string, unknown>;
    anchors["from"] = appConfig.colors.primary;
    anchors["to"] = lightVariant;

    const topbarLinks = data["topbarLinks"] as Array<Record<string, unknown>>;
    if (topbarLinks?.[0]) {
      topbarLinks[0]["url"] = `mailto:${appConfig.urls.supportEmail}`;
    }

    const topbarCta = data["topbarCtaButton"] as Record<string, unknown>;
    if (topbarCta) {
      topbarCta["url"] = appConfig.urls.website;
    }

    if (appConfig.socials) {
      const footerSocials: Record<string, string> = {};
      if (appConfig.socials.github) footerSocials["github"] = appConfig.socials.github;
      if (appConfig.socials.twitter) footerSocials["x"] = appConfig.socials.twitter;
      if (appConfig.socials.discord) footerSocials["discord"] = appConfig.socials.discord;
      data["footerSocials"] = footerSocials;

      const existingAnchors = data["anchors"] as Array<Record<string, unknown>> | undefined;
      if (existingAnchors && appConfig.socials.github) {
        const ghAnchor = existingAnchors.find((a) => a["icon"] === "github");
        if (ghAnchor) ghAnchor["url"] = appConfig.socials.github;
      }
    }
  });

  copyAsset("favicon.svg", "apps/docs/favicon.svg");
  copyAsset("logo-light.svg", "apps/docs/logo/light.svg");
  copyAsset("logo-dark.svg", "apps/docs/logo/dark.svg");
}

// ---------------------------------------------------------------------------
// 3. Generate theme.css for Next.js apps
// ---------------------------------------------------------------------------
function syncNextApps(): void {
  console.log("\n[Web + Admin] Generating theme.css + copying assets...");

  const themeContent = generateFullThemeFile(appConfig.colors.primary);

  writeFile("apps/web/src/app/theme.css", themeContent);
  writeFile("apps/admin/src/app/theme.css", themeContent);

  for (const app of ["apps/web", "apps/admin"]) {
    copyAsset("favicon.svg", `${app}/public/favicon.svg`);
    copyAsset("logo-light.svg", `${app}/public/logo-light.svg`);
    copyAsset("logo-dark.svg", `${app}/public/logo-dark.svg`);
    copyAsset("icon-192.png", `${app}/public/icon-192.png`);
    copyAsset("icon-512.png", `${app}/public/icon-512.png`);
    copyAsset("apple-touch-icon.png", `${app}/public/apple-touch-icon.png`);
  }
}

// ---------------------------------------------------------------------------
// 4. Generate OG image from banner + slogan
// ---------------------------------------------------------------------------
function findBanner(): string | null {
  const bannerNames = readdirSync(ASSETS_DIR).filter((f) => {
    const ext = extname(f).toLowerCase();
    return f.startsWith("og-banner") && [".png", ".jpg", ".jpeg"].includes(ext);
  });
  return bannerNames.length > 0 ? resolve(ASSETS_DIR, bannerNames[0]!) : null;
}

async function syncOgImage(): Promise<void> {
  console.log("\n[OG Image] Generating OpenGraph image...");

  const bannerPath = findBanner();
  if (!bannerPath) {
    console.warn("  Skipped: no og-banner.{png,jpg} found in assets/");
    return;
  }

  const png = await generateOgPng({
    config: appConfig,
    bannerPath,
    assetsDir: ASSETS_DIR,
  });

  const ogPath = resolve(ASSETS_DIR, "og.png");
  writeFileSync(ogPath, png);
  console.log("  Generated assets/og.png");

  for (const app of ["apps/web", "apps/admin"]) {
    const dest = resolve(ROOT, app, "public/og.png");
    ensureDir(dirname(dest));
    copyFileSync(ogPath, dest);
    console.log(`  Copied og.png -> ${app}/public/og.png`);
  }
}

// ---------------------------------------------------------------------------
// 5. Generate PNG icons from favicon.svg
// ---------------------------------------------------------------------------
async function generateIcons(): Promise<void> {
  console.log("\n[Icons] Generating PNG icons from favicon.svg...");

  const svgPath = resolve(ASSETS_DIR, "favicon.svg");
  if (!existsSync(svgPath)) {
    console.warn("  Skipped: favicon.svg not found in assets/");
    return;
  }

  const svgBuffer = readFileSync(svgPath);

  const sizes: Array<{ name: string; size: number }> = [
    { name: "icon-512.png", size: 512 },
    { name: "icon-192.png", size: 192 },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  for (const { name, size } of sizes) {
    const outPath = resolve(ASSETS_DIR, name);
    if (existsSync(outPath)) {
      console.log(`  Skipped ${name} (already exists)`);
      continue;
    }
    await sharp(svgBuffer).resize(size, size).png().toFile(outPath);
    console.log(`  Generated ${name} (${size}x${size})`);
  }
}

// ---------------------------------------------------------------------------
// 6. Generate manifest.json for Next.js apps
// ---------------------------------------------------------------------------
function syncManifest(): void {
  console.log("\n[Manifest] Generating web app manifest...");

  const manifest = {
    name: appConfig.name,
    short_name: appConfig.name,
    description: appConfig.description,
    start_url: "/",
    display: "standalone" as const,
    background_color: "#ffffff",
    theme_color: appConfig.colors.primary,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };

  for (const app of ["apps/web", "apps/admin"]) {
    writeFile(`${app}/public/manifest.json`, JSON.stringify(manifest, null, 2) + "\n");
  }
}

// ---------------------------------------------------------------------------
// Run all syncs
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  console.log("Syncing app config...");
  console.log(`  App: ${appConfig.name} (${appConfig.slug})`);
  console.log(`  Primary color: ${appConfig.colors.primary}`);

  await generateIcons();
  syncReactNative();
  syncDocs();
  syncNextApps();
  syncManifest();
  await syncOgImage();

  console.log("\nDone! Config synced across all apps.");
}

main();
