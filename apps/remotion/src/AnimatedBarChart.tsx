import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const DATA = [
  { label: "React", value: 92, color: "#61dafb" },
  { label: "Vue", value: 68, color: "#42b883" },
  { label: "Svelte", value: 54, color: "#ff3e00" },
  { label: "Angular", value: 45, color: "#dd1b16" },
  { label: "Solid", value: 38, color: "#446b9e" },
  { label: "Qwik", value: 28, color: "#18b6f6" },
];

const CHART_HEIGHT = 500;
const BAR_GAP = 24;
const STAGGER = 5;

export const AnimatedBarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 20], [-20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const subtitleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
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
      }}
    >
      <div style={{ marginBottom: 50 }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: 48,
            fontWeight: 700,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          Framework Satisfaction
        </div>
        <div
          style={{
            color: "#666666",
            fontSize: 22,
            marginTop: 8,
            opacity: subtitleOpacity,
          }}
        >
          Developer satisfaction scores (%)
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: BAR_GAP,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {DATA.map((item, i) => {
          const progress = spring({
            frame,
            fps,
            delay: 20 + i * STAGGER,
            config: { damping: 200 },
          });

          const barWidth = interpolate(progress, [0, 1], [0, item.value]);
          const labelOpacity = interpolate(progress, [0.3, 0.8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  color: "#888888",
                  fontSize: 20,
                  width: 100,
                  textAlign: "right",
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {item.label}
              </div>
              <div style={{ flex: 1, position: "relative", height: 44 }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${barWidth}%`,
                    backgroundColor: item.color,
                    borderRadius: 8,
                    boxShadow: `0 4px 20px ${item.color}44`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: `${barWidth + 1.5}%`,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#ffffff",
                    fontSize: 18,
                    fontWeight: 600,
                    opacity: labelOpacity,
                  }}
                >
                  {item.value}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
