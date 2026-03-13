import { loadFont } from "@remotion/google-fonts/Inter";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const POINTS = [
  { x: 100, y: 500 },
  { x: 250, y: 380 },
  { x: 400, y: 420 },
  { x: 550, y: 280 },
  { x: 700, y: 320 },
  { x: 850, y: 180 },
  { x: 1000, y: 220 },
  { x: 1150, y: 120 },
  { x: 1300, y: 160 },
  { x: 1450, y: 80 },
  { x: 1600, y: 140 },
  { x: 1750, y: 60 },
];

const generateSmoothPath = (
  points: Array<{ x: number; y: number }>,
): string => {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
};

const PATH = generateSmoothPath(POINTS);

const GRID_LINES_Y = [100, 200, 300, 400, 500];

export const LinePathAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const drawProgress = interpolate(frame, [15, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const { strokeDasharray, strokeDashoffset } = evolvePath(drawProgress, PATH);

  const pathLength = getLength(PATH);
  const dotPoint = getPointAtLength(PATH, drawProgress * pathLength);

  const gridOpacity = interpolate(frame, [0, 15], [0, 0.3], {
    extrapolateRight: "clamp",
  });

  const glowOpacity = interpolate(drawProgress, [0, 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 42,
            fontWeight: 700,
            opacity: titleOpacity,
          }}
        >
          Growth Trajectory
        </div>
        <div
          style={{
            color: "#10b981",
            fontSize: 28,
            fontWeight: 600,
            opacity: titleOpacity,
          }}
        >
          +247%
        </div>
      </div>

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {GRID_LINES_Y.map((y) => (
          <line
            key={y}
            x1={80}
            y1={y + 120}
            x2={1840}
            y2={y + 120}
            stroke="#ffffff"
            strokeOpacity={gridOpacity}
            strokeWidth={1}
            strokeDasharray="8 8"
          />
        ))}

        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(0, 120)">
          <path
            d={PATH}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth={4}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {drawProgress > 0 && (
            <circle
              cx={dotPoint.x}
              cy={dotPoint.y}
              r={10}
              fill="#10b981"
              opacity={glowOpacity}
              filter="url(#glow)"
            />
          )}

          {POINTS.map((point, i) => {
            const pointProgress = interpolate(
              drawProgress,
              [i / POINTS.length, (i + 0.5) / POINTS.length],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <circle
                key={`${point.x}-${point.y}`}
                cx={point.x}
                cy={point.y}
                r={5 * pointProgress}
                fill="#ffffff"
                opacity={pointProgress}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
