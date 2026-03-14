import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const CHART_TITLE = "AEIR — Personal Growth Impact";
const DATA_LABELS = ["Focus", "Habits", "Mindset", "Fitness", "Learning", "Sleep"];
const DATA_VALUES = [35, 52, 68, 75, 82, 91];
const PRIMARY_COLOR = "#6C5CE7";
const ACCENT_COLOR = "#A29BFE";
const BG_COLOR = "#0f172a";
const TEXT_COLOR = "#f1f5f9";
const BAR_STAGGER = 6;

const CHART_AREA = {
  x: 260,
  y: 200,
  width: 1400,
  height: 600,
};

export const AeirDataViz: React.FC = () => {
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

  const barCount = DATA_VALUES.length;
  const barGap = 24;
  const barWidth = (CHART_AREA.width - barGap * (barCount + 1)) / barCount;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_COLOR,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Grid lines */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {[0, 25, 50, 75, 100].map((tick) => {
          const y =
            CHART_AREA.y +
            CHART_AREA.height -
            (tick / 100) * CHART_AREA.height;
          const gridOpacity = interpolate(frame, [15, 35], [0, 0.15], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={tick}>
              <line
                x1={CHART_AREA.x}
                y1={y}
                x2={CHART_AREA.x + CHART_AREA.width}
                y2={y}
                stroke={TEXT_COLOR}
                strokeOpacity={gridOpacity}
                strokeWidth={1}
                strokeDasharray="6 4"
              />
              <text
                x={CHART_AREA.x - 16}
                y={y + 5}
                textAnchor="end"
                fill={TEXT_COLOR}
                fontSize={16}
                opacity={gridOpacity * 3}
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {DATA_VALUES.map((value, i) => {
          const barDelay = 20 + i * BAR_STAGGER;
          const barProgress = spring({
            frame,
            fps,
            delay: barDelay,
            config: { damping: 200 },
          });

          const barHeight = barProgress * (value / 100) * CHART_AREA.height;
          const barX = CHART_AREA.x + barGap + i * (barWidth + barGap);
          const barY = CHART_AREA.y + CHART_AREA.height - barHeight;

          const labelDelay = barDelay + 18;
          const labelOpacity = interpolate(
            frame,
            [labelDelay, labelDelay + 12],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          const gradientId = `barGrad-${i}`;

          return (
            <g key={i}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT_COLOR} />
                  <stop offset="100%" stopColor={PRIMARY_COLOR} />
                </linearGradient>
              </defs>

              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx={8}
                fill={`url(#${gradientId})`}
              />

              {/* Value label */}
              <text
                x={barX + barWidth / 2}
                y={barY - 14}
                textAnchor="middle"
                fill={TEXT_COLOR}
                fontSize={22}
                fontWeight={700}
                opacity={labelOpacity}
              >
                +{value}%
              </text>

              {/* X-axis label */}
              <text
                x={barX + barWidth / 2}
                y={CHART_AREA.y + CHART_AREA.height + 36}
                textAnchor="middle"
                fill={TEXT_COLOR}
                fontSize={20}
                fontWeight={500}
                opacity={labelOpacity}
              >
                {DATA_LABELS[i]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: TEXT_COLOR,
            letterSpacing: "-0.02em",
          }}
        >
          {CHART_TITLE}
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 140,
          width: "100%",
          textAlign: "center",
          opacity: subtitleOpacity,
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: ACCENT_COLOR,
            letterSpacing: "0.04em",
          }}
        >
          Average improvement across 10,000 users over 90 days
        </span>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
          textAlign: "center",
          opacity: interpolate(frame, [fps * 5, fps * 5 + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: TEXT_COLOR,
            letterSpacing: "0.06em",
          }}
        >
          AEIR
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: ACCENT_COLOR,
            marginLeft: 16,
          }}
        >
          Your personal improvement agent
        </span>
      </div>
    </AbsoluteFill>
  );
};
