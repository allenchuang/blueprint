import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/google-fonts/InstrumentSerif";
import { appConfig } from "@repo/app-config";

const { fontFamily } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const PRIMARY = appConfig.colors.primary;
const TEXT_COLOR = "#ffffff";
const TEXT_SHADOW = "0 3px 16px rgba(0, 0, 0, 0.3)";
const SMOOTH = { damping: 200 };
const T = 20;

// ---------------------------------------------------------------------------
// Features from README (lines 85-99)
// ---------------------------------------------------------------------------

const FEATURES = [
  { emoji: "\u{1F3A8}", name: "App Config" },
  { emoji: "\u{1F310}", name: "Mini App" },
  { emoji: "\u{1F30D}", name: "i18n" },
  { emoji: "\u{1F4F1}", name: "Mobile-First UX" },
  { emoji: "\u{1F4F2}", name: "PWA" },
  { emoji: "\u{1F9E9}", name: "shadcn/ui" },
  { emoji: "\u{1F504}", name: "React Query" },
  { emoji: "\u{1F5C4}\uFE0F", name: "Database" },
  { emoji: "\u26A1", name: "API Server" },
  { emoji: "\u{1F3AC}", name: "Video Generation" },
  { emoji: "\u{1F4D6}", name: "Documentation" },
  { emoji: "\u{1F4CA}", name: "Analytics" },
  { emoji: "\u{1F510}", name: "Authentication" },
  { emoji: "\u{1F399}\uFE0F", name: "Voice Agent" },
  { emoji: "\u{1F500}", name: "Co-Development" },
];

const FEATURE_INTERVALS = [
  50, 40, 32, 26, 21, 17, 14, 11, 9, 7, 6, 5, 4, 3, 3,
];

// ---------------------------------------------------------------------------
// Blueprint grid overlay
// ---------------------------------------------------------------------------

const BlueprintGrid: React.FC = () => {
  const majorStep = 120;
  const minorStep = 30;
  const w = 1920;
  const h = 1080;

  const majorH: number[] = [];
  for (let y = 0; y <= h; y += majorStep) majorH.push(y);
  const majorV: number[] = [];
  for (let x = 0; x <= w; x += majorStep) majorV.push(x);
  const minorH: number[] = [];
  for (let y = 0; y <= h; y += minorStep) {
    if (y % majorStep !== 0) minorH.push(y);
  }
  const minorV: number[] = [];
  for (let x = 0; x <= w; x += minorStep) {
    if (x % majorStep !== 0) minorV.push(x);
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        {minorH.map((y) => (
          <line
            key={`mh-${y}`}
            x1={0}
            y1={y}
            x2={w}
            y2={y}
            stroke="white"
            strokeWidth="0.5"
            opacity={0.05}
          />
        ))}
        {minorV.map((x) => (
          <line
            key={`mv-${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={h}
            stroke="white"
            strokeWidth="0.5"
            opacity={0.05}
          />
        ))}
        {majorH.map((y) => (
          <line
            key={`Mh-${y}`}
            x1={0}
            y1={y}
            x2={w}
            y2={y}
            stroke="white"
            strokeWidth="1"
            opacity={0.12}
          />
        ))}
        {majorV.map((x) => (
          <line
            key={`Mv-${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={h}
            stroke="white"
            strokeWidth="1"
            opacity={0.12}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene wrapper (gradient + grid)
// ---------------------------------------------------------------------------

const SceneWrapper: React.FC<{
  topColor: string;
  bottomColor: string;
  children: React.ReactNode;
}> = ({ topColor, bottomColor, children }) => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
      }}
    />
    <BlueprintGrid />
    {children}
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Shared typewriter helpers
// ---------------------------------------------------------------------------

const CURSOR_BLINK = 16;

const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(
    frame % CURSOR_BLINK,
    [0, CURSOR_BLINK / 2, CURSOR_BLINK],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <span style={{ opacity, color: PRIMARY }}>{"\u258C"}</span>;
};

const getTypedText = (frame: number, text: string, charFrames: number) =>
  text.slice(0, Math.min(text.length, Math.floor(frame / charFrames)));

// ---------------------------------------------------------------------------
// Typo typewriter engine
// ---------------------------------------------------------------------------

type Keystroke = { char: string } | { del: true };

const buildTypoSequence = (): Keystroke[] => {
  const ks: Keystroke[] = [];
  const type = (s: string) => {
    for (const c of s) ks.push({ char: c });
  };
  const del = (n: number) => {
    for (let i = 0; i < n; i++) ks.push({ del: true });
  };

  type("but often thinsg");
  del(2);
  type("gs goes down the wrogn");
  del(4);
  type("rong path\u2026");

  return ks;
};

const TYPO_KEYS = buildTypoSequence();

const buildTypoSnapshots = (): string[] => {
  const snaps: string[] = [];
  let text = "";
  for (const k of TYPO_KEYS) {
    if ("del" in k) {
      text = text.slice(0, -1);
    } else {
      text += k.char;
    }
    snaps.push(text);
  }
  return snaps;
};

const TYPO_SNAPSHOTS = buildTypoSnapshots();

const getTypoText = (frame: number, charFrames: number): string => {
  const step = Math.floor(frame / charFrames);
  if (step < 0) return "";
  if (step >= TYPO_SNAPSHOTS.length) return TYPO_SNAPSHOTS[TYPO_SNAPSHOTS.length - 1];
  return TYPO_SNAPSHOTS[step];
};

// ---------------------------------------------------------------------------
// Gentle emoji drift
// ---------------------------------------------------------------------------

const getEmojiPos = (index: number, emojiFrame: number, fps: number) => {
  const t = emojiFrame / fps;
  const seed = (index + 1) * 137.508 * (Math.PI / 180);

  const angle = index * 2.399;
  const ring = 280 + (index % 4) * 60;
  const startX = 960 + ring * Math.cos(angle);
  const startY = 540 + ring * Math.sin(angle);

  const dx =
    18 * Math.sin(t * 0.5 + seed) + 10 * Math.sin(t * 1.2 + seed * 2.3);
  const dy =
    14 * Math.cos(t * 0.7 + seed * 1.7) +
    8 * Math.cos(t * 1.4 + seed * 3.1);

  return {
    x: Math.max(40, Math.min(1840, startX + dx)),
    y: Math.max(40, Math.min(1000, startY + dy)),
  };
};

// ---------------------------------------------------------------------------
// Scene 1 — "We all know agents can build…" (typewriter + fade out)
// ---------------------------------------------------------------------------

const HOOK_TEXT = "We all know agents can build\u2026";
const HOOK_CHAR_FRAMES = 3;

const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const typeEndFrame = HOOK_TEXT.length * HOOK_CHAR_FRAMES;
  const fadeStart = typeEndFrame + 15;
  const fadeEnd = fadeStart + 30;

  const textOpacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showCursor = frame < fadeEnd;

  return (
    <SceneWrapper topColor="#e0f2fe" bottomColor="#d0ebfc">
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 100 }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 80,
            color: TEXT_COLOR,
            textShadow: TEXT_SHADOW,
            lineHeight: 1.3,
            textAlign: "center",
            opacity: textOpacity,
          }}
        >
          <span>{getTypedText(frame, HOOK_TEXT, HOOK_CHAR_FRAMES)}</span>
          {showCursor && <Cursor frame={frame} />}
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — Typo typewriter: "but often things goes down the wrong path…"
// ---------------------------------------------------------------------------

const TYPO_CHAR_FRAMES = 2;

const Scene2WrongPath: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneWrapper topColor="#bae6fd" bottomColor="#93d5fa">
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 100 }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 72,
            color: TEXT_COLOR,
            textShadow: TEXT_SHADOW,
            lineHeight: 1.3,
            textAlign: "center",
            maxWidth: 1500,
          }}
        >
          <span>{getTypoText(frame, TYPO_CHAR_FRAMES)}</span>
          <Cursor frame={frame} />
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — "Open sourcing the workspace where agents call home"
// ---------------------------------------------------------------------------

const Scene3OpenSource: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const translateY = interpolate(frame, [0, 24], [36, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <SceneWrapper topColor="#7dd3fc" bottomColor="#5bc2f5">
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 100 }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 72,
            color: TEXT_COLOR,
            textShadow: TEXT_SHADOW,
            textAlign: "center",
            opacity,
            transform: `translateY(${translateY}px)`,
            maxWidth: 1400,
          }}
        >
          Open sourcing the workspace where agents call home
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  );
};

// ---------------------------------------------------------------------------
// Scene Terminal — "npx blueprint-stack" CLI showcase
// ---------------------------------------------------------------------------

const TERMINAL_CMD = "npx blueprint-stack";
const TERMINAL_CMD_CHAR_FRAMES = 2;

// ASCII logo lines (sourced from packages/blueprint-cli/src/utils/logo.ts)
const BLUEPRINT_LOGO_LINES = [
  " ██████╗ ██╗     ██╗   ██╗███████╗██████╗ ██████╗ ██╗███╗   ██╗████████╗",
  " ██╔══██╗██║     ██║   ██║██╔════╝██╔══██╗██╔══██╗██║████╗  ██║╚══██╔══╝",
  " ██████╔╝██║     ██║   ██║█████╗  ██████╔╝██████╔╝██║██╔██╗ ██║   ██║   ",
  " ██╔══██╗██║     ██║   ██║██╔══╝  ██╔═══╝ ██╔══██╗██║██║╚██╗██║   ██║   ",
  " ██████╔╝███████╗╚██████╔╝███████╗██║     ██║  ██║██║██║ ╚████║   ██║   ",
  " ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝   ",
  "════════════════ IDEATION OPERATING SYSTEM  v0.1.27 ════════════════",
];

const TERMINAL_OUTPUT_LINES: { text: string; color: string }[] = [
  { text: "? Project name: › my-app", color: "#d1d5db" },
  { text: "? Include apps: › Web  Mobile  Server", color: "#d1d5db" },
  { text: "", color: "#d1d5db" },
  { text: "  ✓ Next.js web app", color: "#34d399" },
  { text: "  ✓ Expo mobile app", color: "#34d399" },
  { text: "  ✓ Fastify API server", color: "#34d399" },
  { text: "  ✓ Drizzle ORM + Neon database", color: "#34d399" },
  { text: "  ✓ shadcn/ui + Tailwind CSS", color: "#34d399" },
  { text: "  ✓ Privy authentication", color: "#34d399" },
  { text: "  ✓ Stripe payments", color: "#34d399" },
  { text: "  ✓ ElevenLabs voice agent", color: "#34d399" },
  { text: "  ✓ Remotion video generation", color: "#34d399" },
  { text: "", color: "#d1d5db" },
  { text: "  Blueprint ready. Happy building! 🎉", color: "#fbbf24" },
];

const LOGO_LINE_DELAY_F = 3;
const OUTPUT_LINE_DELAY_F = 5;

const SceneTerminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in from bottom with spring physics + 3D perspective tilt
  const slideProgress = spring({ frame, fps, config: { damping: 130, stiffness: 90 } });
  const translateY = interpolate(slideProgress, [0, 1], [480, 0]);
  const rotateXVal = interpolate(slideProgress, [0, 1], [32, 14]);

  // Gentle rotateY oscillation that kicks in after slide settles
  const rotateY = 2.5 * Math.sin((frame / fps) * 1.0);

  // Type the command starting at frame 12
  const cmdStartFrame = 12;
  const cmdTyped = getTypedText(
    Math.max(0, frame - cmdStartFrame),
    TERMINAL_CMD,
    TERMINAL_CMD_CHAR_FRAMES,
  );
  const cmdDoneFrame = cmdStartFrame + TERMINAL_CMD.length * TERMINAL_CMD_CHAR_FRAMES;
  const cmdDone = frame >= cmdDoneFrame;

  // Logo lines appear after typing + brief pause
  const logoStartFrame = cmdDoneFrame + 6;

  // Output lines after logo completes
  const lastLogoFrame =
    logoStartFrame + (BLUEPRINT_LOGO_LINES.length - 1) * LOGO_LINE_DELAY_F;
  const outputStartFrame = lastLogoFrame + LOGO_LINE_DELAY_F + 8;

  return (
    <SceneWrapper topColor="#5bc2f5" bottomColor="#38bdf8">
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          perspective: "1400px",
        }}
      >
        <div
          style={{
            transform: `rotateX(${rotateXVal}deg) rotateY(${rotateY}deg) translateY(${translateY}px)`,
            width: 1440,
            transformOrigin: "center center",
          }}
        >
          {/* Terminal window */}
          <div
            style={{
              background: "#0d1117",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            {/* Traffic-light title bar */}
            <div
              style={{
                background: "#161b22",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#febc2e",
                }}
              />
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#28c840",
                }}
              />
              <span
                style={{
                  color: "#6e7681",
                  fontSize: 14,
                  marginLeft: 14,
                  fontFamily: "monospace",
                  letterSpacing: "0.02em",
                }}
              >
                blueprint — zsh — 80×24
              </span>
            </div>

            {/* Terminal body */}
            <div
              style={{
                padding: "24px 32px 32px",
                fontFamily: "monospace",
                lineHeight: 1.65,
                color: "#c9d1d9",
              }}
            >
              {/* Prompt + command */}
              <div style={{ fontSize: 20, marginBottom: 4 }}>
                <span style={{ color: "#34d399" }}>~ </span>
                <span style={{ color: "#60a5fa" }}>❯ </span>
                <span style={{ color: "#f0f6fc" }}>{cmdTyped}</span>
                {!cmdDone && <Cursor frame={frame} />}
              </div>

              {/* Blueprint ASCII logo */}
              {BLUEPRINT_LOGO_LINES.map((line, i) => {
                const showAt = logoStartFrame + i * LOGO_LINE_DELAY_F;
                if (frame < showAt) return null;
                const lineOpacity = interpolate(frame, [showAt, showAt + 3], [0, 1], {
                  extrapolateRight: "clamp",
                });
                const isTagline = i === BLUEPRINT_LOGO_LINES.length - 1;
                return (
                  <div
                    key={`logo-${i}`}
                    style={{
                      opacity: lineOpacity,
                      color: isTagline ? "#7dd3fc" : "#60a5fa",
                      fontSize: isTagline ? 14 : 11,
                      whiteSpace: "pre",
                      lineHeight: isTagline ? 2 : 1.3,
                    }}
                  >
                    {line}
                  </div>
                );
              })}

              {/* Output lines */}
              {TERMINAL_OUTPUT_LINES.map((line, i) => {
                const showAt = outputStartFrame + i * OUTPUT_LINE_DELAY_F;
                if (frame < showAt) return null;
                const lineOpacity = interpolate(frame, [showAt, showAt + 4], [0, 1], {
                  extrapolateRight: "clamp",
                });
                return (
                  <div
                    key={`out-${i}`}
                    style={{
                      opacity: lineOpacity,
                      color: line.color,
                      fontSize: 18,
                    }}
                  >
                    {line.text || "\u00a0"}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — Feature cascade with large accumulating emojis
// ---------------------------------------------------------------------------

const Scene4Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const featureStarts: number[] = [];
  let activeIndex = 0;
  let cumulative = 0;
  for (let i = 0; i < FEATURES.length; i++) {
    featureStarts.push(cumulative);
    if (frame >= cumulative) activeIndex = i;
    cumulative += FEATURE_INTERVALS[i];
  }

  const allDone = frame >= cumulative;
  const localFrame = allDone ? 0 : frame - featureStarts[activeIndex];
  const interval = FEATURE_INTERVALS[activeIndex];
  const canAnimate = interval >= 10 && !allDone;

  const textScale = canAnimate
    ? interpolate(
        spring({ frame: localFrame, fps, config: SMOOTH }),
        [0, 1],
        [0.88, 1],
      )
    : 1;

  const textOpacity = canAnimate
    ? interpolate(
        spring({ frame: localFrame, fps, config: SMOOTH }),
        [0, 1],
        [0, 1],
      )
    : allDone
      ? 0
      : 1;

  return (
    <SceneWrapper topColor="#38bdf8" bottomColor="#0ea5e9">
      {FEATURES.map((feature, i) => {
        if (frame < featureStarts[i]) return null;
        const emojiAge = frame - featureStarts[i];
        const pos = getEmojiPos(i, emojiAge, fps);

        const emojiOpacity = interpolate(emojiAge, [0, 15], [0, 0.8], {
          extrapolateRight: "clamp",
        });
        const emojiScale = interpolate(emojiAge, [0, 15], [0.2, 1], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        });

        return (
          <div
            key={`emoji-${i}`}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              fontSize: 120,
              opacity: emojiOpacity,
              transform: `scale(${emojiScale}) translate(-50%, -50%)`,
              pointerEvents: "none",
            }}
          >
            {feature.emoji}
          </div>
        );
      })}

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        {!allDone && (
          <div
            style={{
              fontFamily,
              fontSize: 100,
              color: TEXT_COLOR,
              textShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
              textAlign: "center",
              transform: `scale(${textScale})`,
              opacity: textOpacity,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <span style={{ fontSize: 90 }}>
              {FEATURES[activeIndex].emoji}
            </span>
            {FEATURES[activeIndex].name}
          </div>
        )}
      </AbsoluteFill>
    </SceneWrapper>
  );
};

// ---------------------------------------------------------------------------
// Scene 5 — "Your Agents, Your Rules"
// ---------------------------------------------------------------------------

const Scene5YourAgents: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const translateY = interpolate(frame, [0, 24], [36, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <SceneWrapper topColor="#0ea5e9" bottomColor="#0284c7">
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 100 }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 80,
            color: TEXT_COLOR,
            textShadow: TEXT_SHADOW,
            textAlign: "center",
            opacity,
            transform: `translateY(${translateY}px)`,
          }}
        >
          Your Agents, Your Rules
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  );
};

// ---------------------------------------------------------------------------
// Scene 6 — Logo: "Blueprint"
// ---------------------------------------------------------------------------

const Scene6Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: SMOOTH });
  const scale = interpolate(progress, [0, 1], [0.85, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <SceneWrapper topColor="#0284c7" bottomColor="#0369a1">
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 160,
            color: TEXT_COLOR,
            textShadow: "0 6px 32px rgba(0, 0, 0, 0.4)",
            textAlign: "center",
            letterSpacing: "-0.02em",
            transform: `scale(${scale})`,
            opacity,
          }}
        >
          {appConfig.name}
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  );
};

// ---------------------------------------------------------------------------
// Scene 7 — Coming Soon (hard cut from Blueprint)
// ---------------------------------------------------------------------------

const Scene7ComingSoon: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ fontSize: 80, lineHeight: 1 }}>{"\u{1F9E2}"}</div>
        <div
          style={{
            fontFamily,
            fontSize: 56,
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          Coming Soon
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Composition — ~30 seconds
// ---------------------------------------------------------------------------

const FPS = 30;

const S1 = Math.round(5.5 * FPS);
const S2 = 5 * FPS;
const S3 = Math.round(3.5 * FPS);
const S_TERM = Math.round(6.5 * FPS);
const S4 = Math.round(11.3 * FPS);
const S5 = 3 * FPS;
const S6 = 3 * FPS;
const S7 = 2 * FPS;

export const INTRO_DURATION = S1 + S2 + S3 + S_TERM + S4 + S5 + S6 + S7 - T * 6;

export const IntroVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, Math.round(0.5 * fps)], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={S2}>
          <Scene2WrongPath />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={S3}>
          <Scene3OpenSource />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={S_TERM}>
          <SceneTerminal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={S4}>
          <Scene4Features />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={S5}>
          <Scene5YourAgents />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={S6}>
          <Scene6Logo />
        </TransitionSeries.Sequence>

        {/* Hard cut to Coming Soon — no transition */}
        <TransitionSeries.Sequence durationInFrames={S7}>
          <Scene7ComingSoon />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
