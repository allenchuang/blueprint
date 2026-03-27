import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { appConfig } from "@repo/app-config";

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

const WHITE = "#ffffff";
const MUTED = "rgba(255,255,255,0.85)";

// Blueprint gradient: darker at bottom, lighter at top (derived from primary #38BDF8)
const GRADIENT_TOP = "#7dd3fc"; // lighter sky blue
const GRADIENT_BOTTOM = "#0369a1"; // deep blueprint blue

// Font family constants
const HEADING_FONT = "Instrument Serif";
const BODY_FONT = "Inter";

type CardType = "announcement" | "feature" | "quote" | "stat";

interface GenerateCardBody {
  type: CardType;
  title: string;
  subtitle?: string;
  stat?: string;
  cta?: string;
}

function loadFontFile(fileName: string, fallbackFileName?: string): ArrayBuffer {
  const primary = resolve(
    process.cwd(),
    `../../packages/app-config/assets/${fileName}`
  );
  if (existsSync(primary)) {
    const buf = readFileSync(primary);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }

  if (fallbackFileName) {
    const fallback = resolve(
      process.cwd(),
      `../../packages/app-config/assets/${fallbackFileName}`
    );
    if (existsSync(fallback)) {
      const buf = readFileSync(fallback);
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
  }

  // Last resort: system fonts
  const paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
  ];
  for (const p of paths) {
    if (existsSync(p)) {
      const buf = readFileSync(p);
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
  }

  throw new Error(
    `No font found for ${fileName}. Place it at packages/app-config/assets/`
  );
}

function loadHeadingFont(): ArrayBuffer {
  return loadFontFile("heading-font.ttf", "og-font.ttf");
}

function loadBodyFont(): ArrayBuffer {
  return loadFontFile("body-font.ttf");
}

/** Apple-style 🧢 billed cap emoji loaded from PNG asset */
function loadCapEmojiDataUri(): string {
  const capPath = resolve(
    process.cwd(),
    "../../packages/app-config/assets/cap-emoji.png"
  );
  if (existsSync(capPath)) {
    const buf = readFileSync(capPath);
    const b64 = Buffer.from(buf).toString("base64");
    return `data:image/png;base64,${b64}`;
  }
  // Fallback: transparent 1x1 pixel
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
}

const CAP_EMOJI_DATA_URI = loadCapEmojiDataUri();

/** Blueprint 🧢 logo mark — cap emoji rendered as Apple-style PNG image */
function logoMark(size = 84) {
  return {
    type: "img",
    props: {
      src: CAP_EMOJI_DATA_URI,
      width: size,
      height: size,
      style: {
        width: size,
        height: size,
        flexShrink: 0,
      },
    },
  };
}

/** Blueprint gradient background — lighter at top, darker at bottom */
function blueprintBackground() {
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(180deg, ${GRADIENT_TOP} 0%, ${GRADIENT_BOTTOM} 100%)`,
      },
    },
  };
}

/** Blueprint grid overlay — major lines (120px, brighter) + minor lines (30px, barely visible) */
function blueprintGrid() {
  const majorStep = 120;
  const minorStep = 30;
  const children: Record<string, unknown>[] = [];

  // Minor horizontal lines
  for (let y = 0; y <= CARD_HEIGHT; y += minorStep) {
    if (y % majorStep === 0) continue;
    children.push({
      type: "div",
      props: {
        style: {
          position: "absolute",
          top: y,
          left: 0,
          width: CARD_WIDTH,
          height: 1,
          background: "rgba(255,255,255,0.05)",
        },
      },
    });
  }

  // Minor vertical lines
  for (let x = 0; x <= CARD_WIDTH; x += minorStep) {
    if (x % majorStep === 0) continue;
    children.push({
      type: "div",
      props: {
        style: {
          position: "absolute",
          top: 0,
          left: x,
          width: 1,
          height: CARD_HEIGHT,
          background: "rgba(255,255,255,0.05)",
        },
      },
    });
  }

  // Major horizontal lines
  for (let y = 0; y <= CARD_HEIGHT; y += majorStep) {
    children.push({
      type: "div",
      props: {
        style: {
          position: "absolute",
          top: y,
          left: 0,
          width: CARD_WIDTH,
          height: 1,
          background: "rgba(255,255,255,0.12)",
        },
      },
    });
  }

  // Major vertical lines
  for (let x = 0; x <= CARD_WIDTH; x += majorStep) {
    children.push({
      type: "div",
      props: {
        style: {
          position: "absolute",
          top: 0,
          left: x,
          width: 1,
          height: CARD_HEIGHT,
          background: "rgba(255,255,255,0.12)",
        },
      },
    });
  }

  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
      },
      children,
    },
  };
}

function buildAnnouncementCard(body: GenerateCardBody) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: `${BODY_FONT}, system-ui, sans-serif`,
      },
      children: [
        blueprintBackground(),
        blueprintGrid(),
        {
          type: "div",
          props: {
            style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "64px 72px",
              height: "100%",
            },
            children: [
              // Top: logo + app name
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 16 },
                  children: [
                    logoMark(72),
                    {
                      type: "span",
                      props: {
                        style: {
                          color: WHITE,
                          fontSize: 33,
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                        },
                        children: appConfig.name,
                      },
                    },
                  ],
                },
              },
              // Center: title + subtitle (no announcement pill)
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 20 },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          color: WHITE,
                          fontSize: 93,
                          fontWeight: 700,
                          lineHeight: 1.1,
                          letterSpacing: "-0.03em",
                          fontFamily: `${HEADING_FONT}, serif`,
                        },
                        children: body.title,
                      },
                    },
                    body.subtitle
                      ? {
                          type: "div",
                          props: {
                            style: {
                              color: MUTED,
                              fontSize: 42,
                              fontWeight: 400,
                              lineHeight: 1.4,
                            },
                            children: body.subtitle,
                          },
                        }
                      : null,
                  ].filter(Boolean),
                },
              },
              // Bottom: CTA
              body.cta
                ? {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 24px",
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        borderRadius: 12,
                        alignSelf: "flex-start",
                      },
                      children: {
                        type: "span",
                        props: {
                          style: {
                            color: WHITE,
                            fontSize: 27,
                            fontWeight: 600,
                          },
                          children: body.cta,
                        },
                      },
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}

function buildFeatureCard(body: GenerateCardBody) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: `${BODY_FONT}, system-ui, sans-serif`,
      },
      children: [
        blueprintBackground(),
        blueprintGrid(),
        {
          type: "div",
          props: {
            style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "64px 72px",
              height: "100%",
              gap: 32,
            },
            children: [
              // Feature badge
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  },
                  children: [
                    logoMark(60),
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          padding: "6px 16px",
                          background: "rgba(255,255,255,0.15)",
                          border: "1px solid rgba(255,255,255,0.25)",
                          borderRadius: 99,
                        },
                        children: {
                          type: "span",
                          props: {
                            style: {
                              color: WHITE,
                              fontSize: 20,
                              fontWeight: 600,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            },
                            children: "New Feature",
                          },
                        },
                      },
                    },
                  ],
                },
              },
              // Feature name
              {
                type: "div",
                props: {
                  style: {
                    color: WHITE,
                    fontSize: 108,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "-0.04em",
                    fontFamily: `${HEADING_FONT}, serif`,
                  },
                  children: body.title,
                },
              },
              // Description
              body.subtitle
                ? {
                    type: "div",
                    props: {
                      style: {
                        color: MUTED,
                        fontSize: 39,
                        fontWeight: 400,
                        lineHeight: 1.5,
                        maxWidth: 700,
                      },
                      children: body.subtitle,
                    },
                  }
                : null,
              // CTA
              body.cta
                ? {
                    type: "div",
                    props: {
                      style: {
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 27,
                        fontWeight: 500,
                      },
                      children: body.cta,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}

function buildQuoteCard(body: GenerateCardBody) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: `${BODY_FONT}, system-ui, sans-serif`,
      },
      children: [
        blueprintBackground(),
        blueprintGrid(),
        {
          type: "div",
          props: {
            style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "64px 88px",
              height: "100%",
              gap: 32,
              textAlign: "center",
            },
            children: [
              // Big quote mark
              {
                type: "div",
                props: {
                  style: {
                    color: WHITE,
                    fontSize: 180,
                    fontWeight: 700,
                    lineHeight: 0.8,
                    opacity: 0.3,
                    fontFamily: `${HEADING_FONT}, serif`,
                  },
                  children: "\u201C",
                },
              },
              // Quote text (title = the quote itself, uses heading font)
              {
                type: "div",
                props: {
                  style: {
                    color: WHITE,
                    fontSize: 66,
                    fontWeight: 600,
                    lineHeight: 1.35,
                    letterSpacing: "-0.02em",
                    fontFamily: `${HEADING_FONT}, serif`,
                  },
                  children: body.title,
                },
              },
              // Attribution
              body.subtitle
                ? {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              width: 40,
                              height: 1,
                              background: WHITE,
                              opacity: 0.4,
                            },
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              color: MUTED,
                              fontSize: 30,
                              fontWeight: 400,
                            },
                            children: body.subtitle,
                          },
                        },
                      ],
                    },
                  }
                : null,
              // Footer logo
              {
                type: "div",
                props: {
                  style: {
                    position: "absolute",
                    bottom: 40,
                    right: 56,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  },
                  children: [
                    logoMark(48),
                    {
                      type: "span",
                      props: {
                        style: {
                          color: MUTED,
                          fontSize: 24,
                          fontWeight: 600,
                        },
                        children: appConfig.name,
                      },
                    },
                  ],
                },
              },
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}

function buildStatCard(body: GenerateCardBody) {
  const statText = body.stat ?? body.title;
  const label = body.stat ? body.title : (body.subtitle ?? "");

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: `${BODY_FONT}, system-ui, sans-serif`,
      },
      children: [
        blueprintBackground(),
        blueprintGrid(),
        // Vertical accent bar left — white on blueprint bg
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 0,
              top: "20%",
              bottom: "20%",
              width: 4,
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent)",
              borderRadius: "0 4px 4px 0",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "64px 72px",
              height: "100%",
              gap: 24,
              textAlign: "center",
            },
            children: [
              logoMark(78),
              // Big stat
              {
                type: "div",
                props: {
                  style: {
                    color: WHITE,
                    fontSize: 150,
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                    fontFamily: `${HEADING_FONT}, serif`,
                  },
                  children: statText,
                },
              },
              // Label
              label
                ? {
                    type: "div",
                    props: {
                      style: {
                        color: MUTED,
                        fontSize: 42,
                        fontWeight: 400,
                        letterSpacing: "0.01em",
                      },
                      children: label,
                    },
                  }
                : null,
              // CTA
              body.cta
                ? {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        padding: "12px 28px",
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: 10,
                        marginTop: 8,
                      },
                      children: {
                        type: "span",
                        props: {
                          style: {
                            color: WHITE,
                            fontSize: 27,
                            fontWeight: 700,
                          },
                          children: body.cta,
                        },
                      },
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}

function buildCard(body: GenerateCardBody) {
  switch (body.type) {
    case "announcement":
      return buildAnnouncementCard(body);
    case "feature":
      return buildFeatureCard(body);
    case "quote":
      return buildQuoteCard(body);
    case "stat":
      return buildStatCard(body);
    default:
      return buildAnnouncementCard(body);
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: GenerateCardBody;
    try {
      body = (await req.json()) as GenerateCardBody;
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const validTypes: CardType[] = ["announcement", "feature", "quote", "stat"];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const headingFontData = loadHeadingFont();
    const bodyFontData = loadBodyFont();
    const element = buildCard(body);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svg = await satori(element as any, {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      fonts: [
        { name: HEADING_FONT, data: headingFontData, weight: 400, style: "normal" },
        { name: HEADING_FONT, data: headingFontData, weight: 700, style: "normal" },
        { name: BODY_FONT, data: bodyFontData, weight: 400, style: "normal" },
        { name: BODY_FONT, data: bodyFontData, weight: 500, style: "normal" },
        { name: BODY_FONT, data: bodyFontData, weight: 600, style: "normal" },
        { name: BODY_FONT, data: bodyFontData, weight: 700, style: "normal" },
      ],
    });

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: CARD_WIDTH } });
    const pngData = resvg.render().asPng();
    // Convert Buffer → Uint8Array so NextResponse accepts it
    const png = new Uint8Array(pngData);

    return new NextResponse(png, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": png.byteLength.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[twitter/generate-card] Error:", err);
    return NextResponse.json({ error: "Failed to generate card" }, { status: 500 });
  }
}
