import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const DATA = [
  { label: "Product", value: 35, color: "#6366f1" },
  { label: "Marketing", value: 25, color: "#ec4899" },
  { label: "Engineering", value: 20, color: "#10b981" },
  { label: "Operations", value: 12, color: "#f59e0b" },
  { label: "Other", value: 8, color: "#8b5cf6" },
];

const TOTAL = DATA.reduce((sum, d) => sum + d.value, 0);
const RADIUS = 200;
const STROKE_WIDTH = 60;
const CENTER = 300;

export const PieChartAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const circumference = 2 * Math.PI * RADIUS;
  let cumulativeOffset = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        fontFamily,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 120,
      }}
    >
      <div style={{ position: "relative" }}>
        <svg width={CENTER * 2} height={CENTER * 2}>
          {DATA.map((item, i) => {
            const segmentLength = (item.value / TOTAL) * circumference;
            const currentOffset = cumulativeOffset;
            cumulativeOffset += segmentLength;

            const progress = spring({
              frame,
              fps,
              delay: 10 + i * 8,
              config: { damping: 200 },
            });

            const animatedLength = segmentLength * progress;
            const dashOffset = segmentLength - animatedLength;

            return (
              <circle
                key={item.label}
                r={RADIUS}
                cx={CENTER}
                cy={CENTER}
                fill="none"
                stroke={item.color}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${segmentLength} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform={`rotate(${(currentOffset / circumference) * 360 - 90} ${CENTER} ${CENTER})`}
                opacity={interpolate(progress, [0, 0.3], [0, 1], {
                  extrapolateRight: "clamp",
                })}
              />
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 48,
              fontWeight: 700,
              opacity: titleOpacity,
            }}
          >
            $2.4M
          </div>
          <div
            style={{
              color: "#666666",
              fontSize: 18,
              opacity: titleOpacity,
            }}
          >
            Total Budget
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 16,
            opacity: titleOpacity,
          }}
        >
          Budget Allocation
        </div>
        {DATA.map((item, i) => {
          const progress = spring({
            frame,
            fps,
            delay: 10 + i * 8,
            config: { damping: 200 },
          });

          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: interpolate(progress, [0, 0.5], [0, 1], {
                  extrapolateRight: "clamp",
                }),
                transform: `translateX(${interpolate(progress, [0, 1], [20, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: item.color,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 500,
                  width: 140,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  color: "#888888",
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {item.value}%
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
