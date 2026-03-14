import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const CONFIGS = [
  { label: "Smooth", config: { damping: 200 }, color: "#6366f1" },
  { label: "Snappy", config: { damping: 20, stiffness: 200 }, color: "#ec4899" },
  { label: "Bouncy", config: { damping: 8 }, color: "#f59e0b" },
  { label: "Heavy", config: { damping: 15, stiffness: 80, mass: 2 }, color: "#10b981" },
] as const;

const BOX_SIZE = 120;

export const SpringPhysics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        fontFamily,
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: 56,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 80,
          opacity: titleOpacity,
        }}
      >
        Spring Physics
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
          height: 400,
        }}
      >
        {CONFIGS.map((item, i) => {
          const progress = spring({
            frame,
            fps,
            delay: 15 + i * 8,
            config: item.config,
          });

          const translateY = interpolate(progress, [0, 1], [300, 0]);
          const scale = interpolate(progress, [0, 1], [0.3, 1]);

          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              <div
                style={{
                  width: BOX_SIZE,
                  height: BOX_SIZE,
                  backgroundColor: item.color,
                  borderRadius: 20,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  boxShadow: `0 20px 60px ${item.color}66`,
                }}
              />
              <div
                style={{
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 500,
                  opacity: interpolate(progress, [0.5, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  color: "#666666",
                  fontSize: 14,
                  fontFamily: "monospace",
                  opacity: interpolate(progress, [0.7, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {JSON.stringify(item.config)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
