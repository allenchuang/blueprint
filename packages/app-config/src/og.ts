import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import type { AppConfig } from "./types";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

function loadImageAsDataUri(imagePath: string): string {
  if (!existsSync(imagePath)) {
    throw new Error(`Banner image not found: ${imagePath}`);
  }
  const ext = extname(imagePath).toLowerCase().replace(".", "");
  const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  const buf = readFileSync(imagePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function loadFontOrFallback(assetsDir: string): ArrayBuffer {
  const customFont = resolve(assetsDir, "og-font.ttf");
  if (existsSync(customFont)) {
    const buf = readFileSync(customFont);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }

  const systemPaths = [
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    "C:\\Windows\\Fonts\\arial.ttf",
  ];
  for (const p of systemPaths) {
    if (existsSync(p)) {
      const buf = readFileSync(p);
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
  }

  throw new Error(
    "No font found. Place a .ttf file at packages/app-config/assets/og-font.ttf",
  );
}

interface OgOptions {
  config: AppConfig;
  bannerPath: string;
  assetsDir: string;
}

export async function generateOgSvg({
  config,
  bannerPath,
  assetsDir,
}: OgOptions): Promise<string> {
  const bannerDataUri = loadImageAsDataUri(bannerPath);
  const fontData = loadFontOrFallback(assetsDir);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        },
        children: [
          {
            type: "img",
            props: {
              src: bannerDataUri,
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.05) 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "60px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 64,
                      fontWeight: 700,
                      color: "#ffffff",
                      lineHeight: 1.1,
                      marginBottom: "16px",
                    },
                    children: config.name,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 32,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.3,
                    },
                    children: config.slogan,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        { name: "Brand", data: fontData, weight: 400, style: "normal" },
        { name: "Brand", data: fontData, weight: 700, style: "normal" },
      ],
    },
  );

  return svg;
}

export async function generateOgPng(options: OgOptions): Promise<Buffer> {
  const svg = await generateOgSvg(options);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: OG_WIDTH },
  });
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}
