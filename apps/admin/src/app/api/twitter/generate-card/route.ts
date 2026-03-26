import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { appConfig } from "@repo/app-config";

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

const BG = "#0a0f1e";
const ACCENT = "#6366f1";
const ACCENT_MUTED = "rgba(99,102,241,0.15)";
const WHITE = "#ffffff";
const MUTED = "rgba(255,255,255,0.55)";
const BORDER = "rgba(99,102,241,0.25)";

type CardType = "announcement" | "feature" | "quote" | "stat";

interface GenerateCardBody {
  type: CardType;
  title: string;
  subtitle?: string;
  stat?: string;
  cta?: string;
}

function loadFont(): ArrayBuffer {
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

  // Try app-config custom font
  const customFont = resolve(
    process.cwd(),
    "../../packages/app-config/assets/og-font.ttf"
  );
  if (existsSync(customFont)) {
    const buf = readFileSync(customFont);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }

  throw new Error(
    "No font found. Place a .ttf file at packages/app-config/assets/og-font.ttf"
  );
}

/** Blueprint "B" logo mark — indigo circle */
function logoMark(size = 56) {
  return {
    type: "div",
    props: {
      style: {
        width: size,
        height: size,
        borderRadius: "50%",
        background: ACCENT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 0 0 2px ${BORDER}, 0 8px 32px rgba(99,102,241,0.35)`,
      },
      children: {
        type: "span",
        props: {
          style: {
            color: WHITE,
            fontSize: size * 0.5,
            fontWeight: 700,
            lineHeight: 1,
          },
          children: "B",
        },
      },
    },
  };
}

/** Shared dot-grid background decoration */
function dotGrid() {
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      },
    },
  };
}

/** Shared gradient overlay */
function gradientOverlay() {
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)",
      },
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
        background: BG,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "Brand, system-ui, sans-serif",
      },
      children: [
        dotGrid(),
        gradientOverlay(),
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
                    logoMark(48),
                    {
                      type: "span",
                      props: {
                        style: {
                          color: WHITE,
                          fontSize: 22,
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                        },
                        children: appConfig.name,
                      },
                    },
                  ],
                },
              },
              // Center: title + subtitle
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 20 },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "inline-flex",
                          padding: "6px 16px",
                          background: ACCENT_MUTED,
                          border: `1px solid ${BORDER}`,
                          borderRadius: 99,
                          marginBottom: 8,
                        },
                        children: {
                          type: "span",
                          props: {
                            style: {
                              color: ACCENT,
                              fontSize: 14,
                              fontWeight: 600,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            },
                            children: "Announcement",
                          },
                        },
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          color: WHITE,
                          fontSize: 62,
                          fontWeight: 700,
                          lineHeight: 1.1,
                          letterSpacing: "-0.03em",
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
                              fontSize: 28,
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
                        background: ACCENT_MUTED,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 12,
                        alignSelf: "flex-start",
                      },
                      children: {
                        type: "span",
                        props: {
                          style: {
                            color: ACCENT,
                            fontSize: 18,
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
        background: BG,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "Brand, system-ui, sans-serif",
      },
      children: [
        dotGrid(),
        gradientOverlay(),
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
                    logoMark(40),
                    {
                      type: "div",
                      props: {
                        style: {
                          padding: "6px 16px",
                          background: ACCENT_MUTED,
                          border: `1px solid ${BORDER}`,
                          borderRadius: 99,
                        },
                        children: {
                          type: "span",
                          props: {
                            style: {
                              color: ACCENT,
                              fontSize: 13,
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
                    fontSize: 72,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "-0.04em",
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
                        fontSize: 26,
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
                        color: ACCENT,
                        fontSize: 18,
                        fontWeight: 500,
                      },
                      children: `→ ${body.cta}`,
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
        background: BG,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "Brand, system-ui, sans-serif",
      },
      children: [
        dotGrid(),
        // Centered radial glow
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,102,241,0.14) 0%, transparent 70%)",
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
                    color: ACCENT,
                    fontSize: 120,
                    fontWeight: 700,
                    lineHeight: 0.8,
                    opacity: 0.4,
                  },
                  children: "\u201C",
                },
              },
              // Quote text
              {
                type: "div",
                props: {
                  style: {
                    color: WHITE,
                    fontSize: 44,
                    fontWeight: 600,
                    lineHeight: 1.35,
                    letterSpacing: "-0.02em",
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
                              background: ACCENT,
                              opacity: 0.5,
                            },
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              color: MUTED,
                              fontSize: 20,
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
                    logoMark(32),
                    {
                      type: "span",
                      props: {
                        style: {
                          color: MUTED,
                          fontSize: 16,
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
        background: BG,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "Brand, system-ui, sans-serif",
      },
      children: [
        dotGrid(),
        gradientOverlay(),
        // Vertical accent bar left
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 0,
              top: "20%",
              bottom: "20%",
              width: 4,
              background: `linear-gradient(to bottom, transparent, ${ACCENT}, transparent)`,
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
              logoMark(52),
              // Big stat
              {
                type: "div",
                props: {
                  style: {
                    color: WHITE,
                    fontSize: 100,
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
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
                        fontSize: 28,
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
                        padding: "12px 28px",
                        background: ACCENT,
                        borderRadius: 10,
                        marginTop: 8,
                      },
                      children: {
                        type: "span",
                        props: {
                          style: {
                            color: WHITE,
                            fontSize: 18,
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

    const fontData = loadFont();
    const element = buildCard(body);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svg = await satori(element as any, {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      fonts: [
        { name: "Brand", data: fontData, weight: 400, style: "normal" },
        { name: "Brand", data: fontData, weight: 700, style: "normal" },
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
