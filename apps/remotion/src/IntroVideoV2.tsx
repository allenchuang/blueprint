import {
  AbsoluteFill,
  Html5Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont } from "@remotion/google-fonts/InstrumentSerif";
import { appConfig } from "@repo/app-config";

const { fontFamily } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const PRIMARY = appConfig.colors.primary;
const TEXT_COLOR = "#ffffff";
const TEXT_SHADOW = "0 3px 16px rgba(0, 0, 0, 0.3)";
const T = 20;
const T_QUICK = 12; // quick fade for terminal → features

// ---------------------------------------------------------------------------
// Features from README (lines 85-99)
// ---------------------------------------------------------------------------

const FEATURES = [
  { emoji: "\u{1F3A8}", name: "Themes" },
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

const FEATURE_INTERVALS = [22, 17, 14, 11, 9, 7, 6, 5, 5, 4, 4, 3, 3, 3, 3];

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

  type("but sometimes things go");

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
  if (step >= TYPO_SNAPSHOTS.length)
    return TYPO_SNAPSHOTS[TYPO_SNAPSHOTS.length - 1];
  return TYPO_SNAPSHOTS[step];
};

// ---------------------------------------------------------------------------
// Orbiting circles — 3 concentric rings, inspired by Magic UI
// ---------------------------------------------------------------------------

// Ring 0 = inner (5 features: 0,3,6,9,12)
// Ring 1 = middle (5 features: 1,4,7,10,13)
// Ring 2 = outer (5 features: 2,5,8,11,14)
const ORBIT_RINGS = [
  { radius: 420, rps: 0.08,  direction: 1 },  // inner — clockwise
  { radius: 600, rps: 0.052, direction: -1 }, // middle — counter-clockwise
  { radius: 780, rps: 0.032, direction: 1 },  // outer — clockwise
];

const getOrbitPos = (featureIndex: number, frame: number, fps: number) => {
  const ringIndex = featureIndex % 3;
  const posInRing = Math.floor(featureIndex / 3); // 0–4 within each ring (5 per ring)
  const ring = ORBIT_RINGS[ringIndex];
  const baseAngle = (2 * Math.PI * posInRing) / 5 - Math.PI / 2; // evenly spaced, start top
  const angle =
    baseAngle + ring.direction * ring.rps * ((2 * Math.PI) / fps) * frame;
  return {
    x: 960 + ring.radius * Math.cos(angle),
    y: 540 + ring.radius * Math.sin(angle),
  };
};

// ---------------------------------------------------------------------------
// Scene 1 — "We all know agents can build…" (typewriter + fade out)
// ---------------------------------------------------------------------------

const HOOK_TEXT = "We all know agents can build\u2026";
const HOOK_CHAR_FRAMES = 2;

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
            fontSize: 120,
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

const SIDEWAYS_WORD = "sideways";
const SIDEWAYS_START_FRAME = TYPO_SNAPSHOTS.length * TYPO_CHAR_FRAMES + 8;
const SIDEWAYS_DRIFT_OFFSET = 18; // frames after pop-in before drift begins

// rotation: negative = lean left, positive = lean right (max ±20°)
const TERMINAL_ERRORS_DATA = [
  { lines: ["$ deploy.sh", "Error: ENOENT: no such file", "or directory 'config.json'"],  top: 95,  left: 55,   delay: 18, rotation: -12, sound: "pop1.mp3" },
  { lines: ["$ npm run build", "TypeError: Cannot read", "properties of undefined"],       top: 70,  left: 1380, delay: 30, rotation:   9, sound: "pop2.mp3" },
  { lines: ["$ ./start.sh", "FATAL: Process exited", "with code 1"],                       top: 380, left: 1520, delay: 42, rotation:  16, sound: "pop3.mp3" },
  { lines: ["$ api-call", "⚠  429 Too Many Requests", "Rate limit exceeded"],             top: 700, left: 1430, delay: 54, rotation:   7, sound: "pop1.mp3" },
  { lines: ["$ git push", "✗  Build failed", "3 errors, 12 warnings"],                    top: 840, left: 820,  delay: 24, rotation:  -4, sound: "pop2.mp3" },
  { lines: ["$ connect", "Error: ECONNREFUSED", "127.0.0.1:3000"],                         top: 700, left: 60,   delay: 38, rotation: -17, sound: "pop3.mp3" },
  { lines: ["$ eslint .", "SyntaxError: Unexpected", "token at line 42"],                  top: 320, left: 45,   delay: 48, rotation:  -8, sound: "pop1.mp3" },
  { lines: ["$ import Button", "Module not found:", "'./components/Button'"],              top: 55,  left: 780,  delay: 36, rotation:  -5, sound: "pop2.mp3" },
];

const Scene2WrongPath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneWrapper topColor="#bae6fd" bottomColor="#93d5fa">
      {/* Terminal error popups scattered around the scene */}
      {TERMINAL_ERRORS_DATA.map((err, i) => {
        const popProgress = spring({
          frame: Math.max(0, frame - err.delay),
          fps,
          config: { damping: 18, stiffness: 300 },
        });
        const scale   = interpolate(popProgress, [0, 1], [0, 1],   { extrapolateRight: "clamp" });
        const opacity = interpolate(popProgress, [0, 1], [0, 1],   { extrapolateRight: "clamp" });
        // wobble settles to err.rotation so each card rests at its target lean
        const wobble  = interpolate(popProgress, [0, 0.5, 0.8, 1],
          [err.rotation - 6, err.rotation + 4, err.rotation - 2, err.rotation],
          { extrapolateRight: "clamp" });
        return (
          <div
            key={`err-${i}`}
            style={{
              position: "absolute",
              top: err.top,
              left: err.left,
              opacity,
              transform: `scale(${scale}) rotate(${wobble}deg)`,
              transformOrigin: "center center",
              background: "#0d1117",
              border: "1px solid rgba(255,80,80,0.45)",
              borderRadius: 10,
              overflow: "hidden",
              width: 340,
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,80,80,0.12), 0 0 20px rgba(255,80,80,0.12)",
            }}
          >
            {/* Traffic-light bar */}
            <div
              style={{
                background: "#161b22",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderBottom: "1px solid rgba(255,80,80,0.15)",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ color: "#6e7681", fontSize: 13, marginLeft: 6, fontFamily: "monospace" }}>
                bash — 80×24
              </span>
            </div>
            {/* Lines */}
            <div style={{ padding: "12px 16px" }}>
              {err.lines.map((line, li) => (
                <div
                  key={li}
                  style={{
                    fontFamily: "monospace",
                    fontSize: li === 0 ? 18 : 20,
                    color: li === 0 ? "#6e7681" : li === 1 ? "#ff6b6b" : "#fca5a5",
                    lineHeight: 1.55,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Centered typewriter + "sideways" */}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 100 }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily,
              fontSize: 108,
              color: TEXT_COLOR,
              textShadow: TEXT_SHADOW,
              lineHeight: 1.3,
              maxWidth: 1500,
            }}
          >
            <span>{getTypoText(frame, TYPO_CHAR_FRAMES)}</span>
            <Cursor frame={frame} />
          </div>

          {/* "sideways" — quick pop-in, then drift sideways to echo the word's meaning */}
          {(() => {
            const enterProgress = spring({
              frame: Math.max(0, frame - SIDEWAYS_START_FRAME),
              fps,
              config: { damping: 22, stiffness: 460 }, // fast snap
            });
            const driftProgress = spring({
              frame: Math.max(0, frame - (SIDEWAYS_START_FRAME + SIDEWAYS_DRIFT_OFFSET)),
              fps,
              config: { damping: 30, stiffness: 55 }, // slow lazy drift
            });
            const sOpacity = interpolate(enterProgress, [0, 1], [0, 1],    { extrapolateRight: "clamp" });
            const sScale   = interpolate(enterProgress, [0, 1], [0.88, 1], { extrapolateRight: "clamp" });
            // pure left rotation around text center — no X drift
            const sDriftR  = interpolate(driftProgress, [0, 1], [0, -10],  { extrapolateRight: "clamp" });
            return (
              <div
                style={{
                  fontFamily,
                  fontSize: 140,
                  color: TEXT_COLOR,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  lineHeight: 1.15,
                  textAlign: "center",
                  marginTop: 8,
                  opacity: sOpacity,
                  transform: `scale(${sScale}) rotate(${sDriftR}deg)`,
                  transformOrigin: "center center",
                }}
              >
                {SIDEWAYS_WORD}
              </div>
            );
          })()}
        </div>
      </AbsoluteFill>

      {/* Pop sound effects — one per terminal card */}
      {TERMINAL_ERRORS_DATA.map((err, i) => (
        <Sequence key={`pop-${i}`} from={err.delay} durationInFrames={45}>
          <Html5Audio src={staticFile(err.sound)} volume={0.55} />
        </Sequence>
      ))}
    </SceneWrapper>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — Full-frame lobster video with staggered text overlay
// ---------------------------------------------------------------------------

const SCENE3_LINES = [
  "What if...",
  "there's a magical workspace",
  "that agents call home",
];
const SCENE3_LINE_DELAY = 35; // frames between each line appearing
const SCENE3_FIRST_LINE_DELAY = 20; // delay before first line appears

const Scene3WhatIf: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Full-frame lobster video — shifted down to show more sky */}
      <OffthreadVideo
        src={staticFile("lobster-scene.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 25%",
        }}
        muted
      />

      {/* Text overlay — right 1/3 of screen */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
          paddingRight: 120,
        }}
      >
        <div style={{ textAlign: "right" }}>
          {SCENE3_LINES.map((line, i) => {
            const lineStart = SCENE3_FIRST_LINE_DELAY + i * SCENE3_LINE_DELAY;
            const progress = spring({
              frame: Math.max(0, frame - lineStart),
              fps,
              config: { damping: 18, stiffness: 160 },
            });
            const opacity = interpolate(progress, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            });
            const translateY = interpolate(progress, [0, 1], [30, 0], {
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  fontFamily,
                  fontSize: i === 0 ? 76 : 62,
                  color: "#0c2340",
                  textShadow:
                    "0 2px 12px rgba(255, 255, 255, 0.4), 0 1px 4px rgba(255, 255, 255, 0.2)",
                  lineHeight: 1.4,
                  opacity,
                  transform: `translateY(${translateY}px)`,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
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
  const slideProgress = spring({
    frame,
    fps,
    config: { damping: 130, stiffness: 90 },
  });
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
  const cmdDoneFrame =
    cmdStartFrame + TERMINAL_CMD.length * TERMINAL_CMD_CHAR_FRAMES;
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
              <div style={{ fontSize: 30, marginBottom: 4 }}>
                <span style={{ color: "#34d399" }}>~ </span>
                <span style={{ color: "#60a5fa" }}>❯ </span>
                <span style={{ color: "#f0f6fc" }}>{cmdTyped}</span>
                {!cmdDone && <Cursor frame={frame} />}
              </div>

              {/* Blueprint ASCII logo */}
              {BLUEPRINT_LOGO_LINES.map((line, i) => {
                const showAt = logoStartFrame + i * LOGO_LINE_DELAY_F;
                if (frame < showAt) return null;
                const lineOpacity = interpolate(
                  frame,
                  [showAt, showAt + 3],
                  [0, 1],
                  {
                    extrapolateRight: "clamp",
                  },
                );
                const isTagline = i === BLUEPRINT_LOGO_LINES.length - 1;
                return (
                  <div
                    key={`logo-${i}`}
                    style={{
                      opacity: lineOpacity,
                      color: isTagline ? "#7dd3fc" : "#60a5fa",
                      fontSize: isTagline ? 21 : 17,
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
                const lineOpacity = interpolate(
                  frame,
                  [showAt, showAt + 4],
                  [0, 1],
                  {
                    extrapolateRight: "clamp",
                  },
                );
                return (
                  <div
                    key={`out-${i}`}
                    style={{
                      opacity: lineOpacity,
                      color: line.color,
                      fontSize: 27,
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

const FEATURE_TEXT_DELAY = 25; // hold text until fade transition fully completes
const FEATURE_SPRING = { damping: 20, stiffness: 200 };

const Scene4Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Offset frame so text cycling only starts after the fade transition
  const effectiveFrame = Math.max(0, frame - FEATURE_TEXT_DELAY);
  const textVisible = frame >= FEATURE_TEXT_DELAY;

  const featureStarts: number[] = [];
  let activeIndex = 0;
  let cumulative = 0;
  for (let i = 0; i < FEATURES.length; i++) {
    featureStarts.push(cumulative);
    if (effectiveFrame >= cumulative) activeIndex = i;
    cumulative += FEATURE_INTERVALS[i];
  }

  const allDone = effectiveFrame >= cumulative;
  const localFrame = allDone ? 0 : effectiveFrame - featureStarts[activeIndex];
  const interval = FEATURE_INTERVALS[activeIndex];
  const canAnimate = interval >= 10 && !allDone;

  const textScale = canAnimate
    ? interpolate(
        spring({ frame: localFrame, fps, config: FEATURE_SPRING }),
        [0, 1],
        [0.85, 1],
      )
    : 1;

  const textOpacity = canAnimate
    ? interpolate(
        spring({ frame: localFrame, fps, config: FEATURE_SPRING }),
        [0, 1],
        [0, 1],
      )
    : allDone
      ? 0
      : 1;

  // "...and many more" spring entrance
  const moreTrigger = FEATURE_TEXT_DELAY + cumulative;
  const moreProgress = spring({
    frame: Math.max(0, frame - moreTrigger),
    fps,
    config: FEATURE_SPRING,
  });
  const moreOpacity   = interpolate(moreProgress, [0, 1], [0, 1],  { extrapolateRight: "clamp" });
  const moreTranslate = interpolate(moreProgress, [0, 1], [24, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* White bg with blue radial corner glows */}
      <AbsoluteFill
        style={{
          background: [
            "radial-gradient(ellipse 52% 52% at 0% 0%,   rgba(59,130,246,0.28) 0%, transparent 70%)",
            "radial-gradient(ellipse 52% 52% at 100% 0%,  rgba(96,165,250,0.22) 0%, transparent 70%)",
            "radial-gradient(ellipse 52% 52% at 0% 100%,  rgba(96,165,250,0.22) 0%, transparent 70%)",
            "radial-gradient(ellipse 52% 52% at 100% 100%, rgba(59,130,246,0.28) 0%, transparent 70%)",
            "#ffffff",
          ].join(", "),
        }}
      />

      {/* Orbit ring guides (SVG circles centered at 960, 540) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", width: "100%", height: "100%" }}
        >
          {ORBIT_RINGS.map((ring, ri) => (
            <circle
              key={`ring-${ri}`}
              cx={960}
              cy={540}
              r={ring.radius}
              fill="none"
              stroke="rgba(96,165,250,0.30)"
              strokeWidth={2}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Orbiting emojis */}
      {FEATURES.map((feature, i) => {
        const fadeStart = i * 4;
        const emojiOpacity = interpolate(
          frame,
          [fadeStart, fadeStart + 14],
          [0, 1],
          {
            extrapolateRight: "clamp",
          },
        );
        const { x, y } = getOrbitPos(i, frame, fps);
        return (
          <div
            key={`emoji-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontSize: 75,
              opacity: emojiOpacity,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              filter: "drop-shadow(0 2px 8px rgba(59,130,246,0.2))",
            }}
          >
            {feature.emoji}
          </div>
        );
      })}

      {/* Center text — hidden until fade transition fully completes */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {textVisible && !allDone && (
          <div
            style={{
              fontFamily,
              fontSize: 100,
              color: "#1e3a5f",
              textShadow: "0 2px 16px rgba(59,130,246,0.18)",
              textAlign: "center",
              transform: `scale(${textScale})`,
              opacity: textOpacity,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <span style={{ fontSize: 90 }}>{FEATURES[activeIndex].emoji}</span>
            {FEATURES[activeIndex].name}
          </div>
        )}
        {textVisible && allDone && (
          <div
            style={{
              fontFamily,
              fontSize: 80,
              color: "#1e3a5f",
              textShadow: "0 2px 16px rgba(59,130,246,0.18)",
              textAlign: "center",
              opacity: moreOpacity,
              transform: `translateY(${moreTranslate}px)`,
            }}
          >
            ...and many more
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5+6 — Blueprint logo (2s) → blank (0.5s) → Your Agents Your Rules (2s)
// ---------------------------------------------------------------------------

const BLUEPRINT_SHOW_END = 60;  // 2 s at 30 fps
const RULES_SHOW_START  = 75;   // + 0.5 s gap
const SCENE56_SPRING = { damping: 20, stiffness: 200 };
const LOGO_ENTER_DELAY = 16; // stagger: text starts just before slide fully settles
const CAP_ZOOM_START   = LOGO_ENTER_DELAY + 12; // cap springs in after text appears
const CAP_TILT_START   = CAP_ZOOM_START + 24;   // tilt kicks in after zoom settles

const Scene56LogoAndRules: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Blueprint text — springs in after transition settles
  const logoProgress = spring({
    frame: Math.max(0, frame - LOGO_ENTER_DELAY),
    fps,
    config: SCENE56_SPRING,
  });
  const logoOpacity    = interpolate(logoProgress, [0, 1], [0, 1],   { extrapolateRight: "clamp" });
  const logoTranslateY = interpolate(logoProgress, [0, 1], [40, 0],  { extrapolateRight: "clamp" });
  const logoScale      = interpolate(logoProgress, [0, 1], [0.88, 1],{ extrapolateRight: "clamp" });

  // "Your Agents, Your Rules" — springs in from its own trigger point
  const rulesProgress = spring({
    frame: Math.max(0, frame - RULES_SHOW_START),
    fps,
    config: SCENE56_SPRING,
  });
  const rulesOpacity = interpolate(rulesProgress, [0, 1], [0, 1],    { extrapolateRight: "clamp" });
  const rulesScale   = interpolate(rulesProgress, [0, 1], [0.95, 1], { extrapolateRight: "clamp" });

  // 🧢 zooms in over "ep" with a bouncy spring, then tilts 15° right
  const capZoomProgress = spring({
    frame: Math.max(0, frame - CAP_ZOOM_START),
    fps,
    config: { damping: 10, stiffness: 130 },
  });
  const capScale = interpolate(capZoomProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const capTiltProgress = spring({
    frame: Math.max(0, frame - CAP_TILT_START),
    fps,
    config: { damping: 14, stiffness: 180 },
  });
  const capTilt = interpolate(capTiltProgress, [0, 1], [0, 15], { extrapolateRight: "clamp" });

  return (
    <SceneWrapper topColor="#0284c7" bottomColor="#0369a1">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {frame < BLUEPRINT_SHOW_END && (
          <div
            style={{
              fontFamily,
              fontSize: 240,
              color: TEXT_COLOR,
              textShadow: "0 6px 32px rgba(0, 0, 0, 0.4)",
              letterSpacing: "-0.02em",
              opacity: logoOpacity,
              transform: `translateY(${logoTranslateY}px) scale(${logoScale})`,
              display: "inline-block",
              position: "relative",
            }}
          >
            Blu
            <span style={{ position: "relative", display: "inline-block" }}>
              ep
              {/* Cap sits on top of lowercase "ep", zooms in then tilts 15° right */}
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "-0.3em",
                  fontSize: "0.65em",
                  lineHeight: 1,
                  transform: `translate(-50%, 0) scale(${capScale}) rotate(${capTilt}deg)`,
                  transformOrigin: "center center",
                  display: "block",
                  userSelect: "none",
                }}
              >
                🧢
              </span>
            </span>
            rint
          </div>
        )}
        {frame >= RULES_SHOW_START && (
          <div
            style={{
              fontFamily,
              fontSize: 120,
              color: TEXT_COLOR,
              textShadow: TEXT_SHADOW,
              textAlign: "center",
              opacity: rulesOpacity,
              transform: `scale(${rulesScale})`,
            }}
          >
            Your Agents, Your Rules
          </div>
        )}
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
          fontFamily,
          fontSize: 84,
          color: "#ffffff",
          letterSpacing: "-0.01em",
          opacity,
        }}
      >
        Coming Soon
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Composition — ~30 seconds
// ---------------------------------------------------------------------------

const FPS = 30;

const S1 = Math.round(3.5 * FPS);   // shortened — scene 3 gets the extra time
const S2 = 5 * FPS;
const S3 = Math.round(7.5 * FPS);   // longer to fit cycling words + final phrase
const S_TERM = Math.round(6.5 * FPS);
const S4 = Math.round(6.5 * FPS);
const S56 = Math.round(4.5 * FPS); // Blueprint 2s + 0.5s gap + Your Rules 2s
const S7 = 2 * FPS;

// Transitions: S1→S2: T, S2→S3: T_QUICK (fast), S3→TERM: T, TERM→S4: T_QUICK, S4→S56: T
export const INTRO_DURATION_V2 = S1 + S2 + S3 + S_TERM + S4 + S56 + S7 - T * 3 - T_QUICK * 2;

export const IntroVideoV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, Math.round(0.5 * fps)], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <Html5Audio src={staticFile("st2.mp3")} trimBefore={83 * FPS} />
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
          timing={linearTiming({ durationInFrames: T_QUICK })}
        />

        <TransitionSeries.Sequence durationInFrames={S3}>
          <Scene3WhatIf />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={S_TERM}>
          <SceneTerminal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T_QUICK })}
        />

        <TransitionSeries.Sequence durationInFrames={S4}>
          <Scene4Features />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={S56}>
          <Scene56LogoAndRules />
        </TransitionSeries.Sequence>

        {/* Hard cut to Coming Soon — no transition */}
        <TransitionSeries.Sequence durationInFrames={S7}>
          <Scene7ComingSoon />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
