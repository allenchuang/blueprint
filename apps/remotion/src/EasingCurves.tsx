import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const TRACK_WIDTH = 1400;
const DOT_SIZE = 32;

const EASINGS = [
  { label: "linear", fn: Easing.linear, color: "#94a3b8" },
  { label: "ease-in (quad)", fn: Easing.in(Easing.quad), color: "#6366f1" },
  { label: "ease-out (quad)", fn: Easing.out(Easing.quad), color: "#ec4899" },
  { label: "ease-in-out (quad)", fn: Easing.inOut(Easing.quad), color: "#f59e0b" },
  { label: "ease-in (exp)", fn: Easing.in(Easing.exp), color: "#10b981" },
  { label: "ease-out (circle)", fn: Easing.out(Easing.circle), color: "#8b5cf6" },
  { label: "bezier(.8,.22,.96,.65)", fn: Easing.bezier(0.8, 0.22, 0.96, 0.65), color: "#ef4444" },
] as const;

export const EasingCurves: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        fontFamily,
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: 48,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 50,
          opacity: titleOpacity,
        }}
      >
        Easing Curves
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {EASINGS.map((easing, i) => {
          const delay = 10 + i * 4;
          const duration = 2 * fps;
          const progress = interpolate(frame - delay, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easing.fn,
          });

          const labelOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={easing.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  color: easing.color,
                  fontSize: 16,
                  fontFamily: "monospace",
                  width: 260,
                  textAlign: "right",
                  opacity: labelOpacity,
                  flexShrink: 0,
                }}
              >
                {easing.label}
              </div>
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: DOT_SIZE + 16,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: "#1e1e1e",
                    transform: "translateY(-50%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: progress * (TRACK_WIDTH - DOT_SIZE),
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: DOT_SIZE / 2,
                    backgroundColor: easing.color,
                    transform: "translateY(-50%)",
                    boxShadow: `0 0 20px ${easing.color}88`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
