import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fadeIn(frame: number, start: number, duration: number) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function slideUp(
  frame: number,
  start: number,
  fps: number,
  distance = 40
): number {
  const s = spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 120 } });
  return interpolate(s, [0, 1], [distance, 0]);
}

// ─── Scene 1: Blueprint OS title (0–2.5s / frames 0–75) ─────────────────────

const Scene1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const opacity = fadeIn(frame, 0, 20);
  const translateY = slideUp(frame, 0, fps, 50);

  const tagOpacity = fadeIn(frame, 30, 25);
  const tagY = slideUp(frame, 30, fps, 30);

  // Animated "grid" background lines
  const gridOpacity = interpolate(frame, [0, 40], [0, 0.15], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 100%)" }}>
      {/* Grid background */}
      <AbsoluteFill style={{ opacity: gridOpacity }}>
        <svg width="100%" height="100%" style={{ position: "absolute" }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 96}
              y1={0}
              x2={i * 96}
              y2={1080}
              stroke="#4fc3f7"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * 90}
              x2={1920}
              y2={i * 90}
              stroke="#4fc3f7"
              strokeWidth={1}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Title */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Blueprint icon */}
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <rect x="4" y="4" width="64" height="64" rx="16" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="2" />
            <rect x="16" y="16" width="12" height="12" rx="3" fill="#6366f1" />
            <rect x="16" y="32" width="40" height="3" rx="1.5" fill="#6366f1" opacity="0.7" />
            <rect x="16" y="42" width="28" height="3" rx="1.5" fill="#6366f1" opacity="0.5" />
            <rect x="16" y="52" width="20" height="3" rx="1.5" fill="#6366f1" opacity="0.3" />
            <rect x="32" y="16" width="24" height="12" rx="3" fill="none" stroke="#6366f1" strokeWidth="2" />
          </svg>
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Blueprint
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 300,
              color: "#6366f1",
              letterSpacing: "-2px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            OS
          </span>
        </div>

        <div
          style={{
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            fontSize: 32,
            color: "rgba(255,255,255,0.55)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 400,
            letterSpacing: "0.5px",
          }}
        >
          The full-stack OS for building and shipping apps
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Features (frames 75–165 / 2.5s–5.5s) ──────────────────────────

const features = [
  { icon: "⚡", label: "Next.js 15 + React 19" },
  { icon: "🗄️", label: "Drizzle + Neon Postgres" },
  { icon: "📱", label: "Mobile, Web & Desktop" },
  { icon: "🎨", label: "One-command theming" },
];

const Scene2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const titleOp = fadeIn(frame, 0, 20);
  const titleY = slideUp(frame, 0, fps, 30);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 100%)" }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 48,
          padding: "0 120px",
        }}
      >
        <div
          style={{
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
          }}
        >
          Everything you need to ship
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          {features.map((f, i) => {
            const delay = i * 12;
            const op = fadeIn(frame, delay + 10, 20);
            const y = slideUp(frame, delay + 10, fps, 40);
            return (
              <div
                key={f.label}
                style={{
                  opacity: op,
                  transform: `translateY(${y}px)`,
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 20,
                  padding: "36px 44px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  minWidth: 280,
                }}
              >
                <span style={{ fontSize: 52 }}>{f.icon}</span>
                <span
                  style={{
                    fontSize: 26,
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {f.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Clawbot (frames 165–240 / 5.5s–8s) ────────────────────────────

const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const leftOp = fadeIn(frame, 0, 25);
  const leftX = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 100 } }),
    [0, 1],
    [-80, 0]
  );

  const rightOp = fadeIn(frame, 15, 25);
  const rightX = interpolate(
    spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 100 } }),
    [0, 1],
    [80, 0]
  );

  const arrowOp = fadeIn(frame, 35, 20);
  const pulseScale = interpolate(
    Math.sin((frame / 8) * Math.PI),
    [-1, 1],
    [0.95, 1.05]
  );

  const taglineOp = fadeIn(frame, 45, 25);
  const taglineY = slideUp(frame, 45, fps, 20);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0f0d1e 100%)" }}>
      {/* Purple glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 60,
        }}
      >
        {/* Two cards + arrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          {/* Blueprint card */}
          <div
            style={{
              opacity: leftOp,
              transform: `translateX(${leftX}px)`,
              background: "rgba(99,102,241,0.12)",
              border: "2px solid rgba(99,102,241,0.5)",
              borderRadius: 24,
              padding: "40px 56px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 64 }}>🏗️</span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Blueprint OS
            </span>
            <span
              style={{
                fontSize: 22,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Your app platform
            </span>
          </div>

          {/* Arrow */}
          <div
            style={{
              opacity: arrowOp,
              transform: `scale(${pulseScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="120" height="40" viewBox="0 0 120 40">
              <defs>
                <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <line x1="10" y1="20" x2="100" y2="20" stroke="url(#arrowGrad)" strokeWidth="3" />
              <polyline points="88,8 110,20 88,32" fill="none" stroke="url(#arrowGrad)" strokeWidth="3" strokeLinejoin="round" />
              <line x1="20" y1="20" x2="10" y2="20" stroke="url(#arrowGrad)" strokeWidth="3" />
              <polyline points="22,8 0,20 22,32" fill="none" stroke="url(#arrowGrad)" strokeWidth="3" strokeLinejoin="round" />
            </svg>
            <span
              style={{
                fontSize: 18,
                color: "rgba(139,92,246,0.9)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              powered by
            </span>
          </div>

          {/* Clawbot card */}
          <div
            style={{
              opacity: rightOp,
              transform: `translateX(${rightX}px)`,
              background: "rgba(139,92,246,0.12)",
              border: "2px solid rgba(139,92,246,0.5)",
              borderRadius: 24,
              padding: "40px 56px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 64 }}>🤖</span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Clawbot
            </span>
            <span
              style={{
                fontSize: 22,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Your AI co-pilot
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOp,
            transform: `translateY(${taglineY}px)`,
            fontSize: 30,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          Build, deploy, and manage — all from a conversation
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Finale (frames 240–300 / 8s–10s) ──────────────────────────────

const Scene4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const bgScale = interpolate(frame, [0, 60], [1.05, 1], { extrapolateRight: "clamp" });
  const op = fadeIn(frame, 0, 20);
  const titleY = slideUp(frame, 0, fps, 40);

  const subtitleOp = fadeIn(frame, 20, 25);
  const subtitleY = slideUp(frame, 20, fps, 25);

  const badgeOp = fadeIn(frame, 38, 20);

  // Fade out at very end
  const exitOp = interpolate(frame, [50, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 100%)",
        opacity: exitOp,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(99,102,241,${interpolate(frame, [0, 30], [0, 0.2], { extrapolateRight: "clamp" })}) 0%, transparent 65%)`,
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${bgScale})`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 28,
          opacity: op,
        }}
      >
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            fontSize: 88,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-1.5px",
            textAlign: "center",
          }}
        >
          Build smarter.
          <br />
          <span style={{ color: "#6366f1" }}>Ship faster.</span>
        </div>

        <div
          style={{
            opacity: subtitleOp,
            transform: `translateY(${subtitleY}px)`,
            fontSize: 30,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 400,
          }}
        >
          Blueprint OS × Clawbot — the future of app development
        </div>

        <div
          style={{
            opacity: badgeOp,
            display: "flex",
            gap: 16,
            marginTop: 16,
          }}
        >
          {["🏗️ Blueprint OS", "🤖 Clawbot", "⚡ OpenClaw"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.35)",
                borderRadius: 100,
                padding: "12px 28px",
                fontSize: 22,
                color: "rgba(255,255,255,0.75)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Root Composition ────────────────────────────────────────────────────────

export const BlueprintIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Scene 1: 0–90 */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1 frame={frame} fps={fps} />
      </Sequence>

      {/* Scene 2: 80–170 (overlap 10 frames for smooth transition) */}
      <Sequence from={80} durationInFrames={90}>
        <div style={{ opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Scene2 frame={frame - 80} fps={fps} />
        </div>
      </Sequence>

      {/* Scene 3: 160–250 */}
      <Sequence from={160} durationInFrames={90}>
        <div style={{ opacity: interpolate(frame, [160, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Scene3 frame={frame - 160} fps={fps} />
        </div>
      </Sequence>

      {/* Scene 4: 240–300 */}
      <Sequence from={240} durationInFrames={60}>
        <div style={{ opacity: interpolate(frame, [240, 255], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Scene4 frame={frame - 240} fps={fps} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
