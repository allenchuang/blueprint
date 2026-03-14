import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const ITEMS = [
  { icon: "01", title: "Design", desc: "Craft the visual language" },
  { icon: "02", title: "Develop", desc: "Build with precision" },
  { icon: "03", title: "Animate", desc: "Bring it to life" },
  { icon: "04", title: "Deploy", desc: "Ship to the world" },
  { icon: "05", title: "Iterate", desc: "Refine and improve" },
];

const STAGGER_DELAY = 6;

export const StaggeredList: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 20], [-20, 0], {
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
      <div
        style={{
          color: "#ffffff",
          fontSize: 48,
          fontWeight: 700,
          marginBottom: 60,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Staggered Entrance
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {ITEMS.map((item, i) => {
          const progress = spring({
            frame,
            fps,
            delay: 20 + i * STAGGER_DELAY,
            config: { damping: 200 },
          });

          const translateX = interpolate(progress, [0, 1], [-80, 0]);
          const opacity = interpolate(progress, [0, 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={item.icon}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "24px 32px",
                backgroundColor: `rgba(255,255,255,${0.04 * progress})`,
                borderRadius: 16,
                borderLeft: `3px solid rgba(99,102,241,${progress})`,
                transform: `translateX(${translateX}px)`,
                opacity,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  backgroundColor: "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: 20,
                  fontWeight: 700,
                  flexShrink: 0,
                  transform: `scale(${progress})`,
                }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  style={{
                    color: "#ffffff",
                    fontSize: 28,
                    fontWeight: 600,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: "#666666",
                    fontSize: 18,
                    marginTop: 4,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
