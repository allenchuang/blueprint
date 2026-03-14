import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const ScaleReveal: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const rotation = interpolate(spring({ frame, fps, config: { damping: 200 } }), [0, 1], [-15, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#6366f1",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: 120,
          fontWeight: 900,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          textTransform: "uppercase",
          letterSpacing: -4,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const SplitReveal: React.FC<{ words: string[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        gap: 20,
      }}
    >
      <div style={{ display: "flex", gap: 30 }}>
        {words.map((word, i) => {
          const progress = spring({
            frame,
            fps,
            delay: i * 6,
            config: { damping: 15 },
          });

          const translateY = interpolate(progress, [0, 1], [100, 0]);
          const opacity = interpolate(progress, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={`${word}-${i}`}
              style={{
                color: "#ffffff",
                fontSize: 96,
                fontWeight: 800,
                transform: `translateY(${translateY}px)`,
                opacity,
                overflow: "hidden",
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const RotateIn: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ec4899",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        perspective: 1000,
      }}
    >
      <div style={{ display: "flex" }}>
        {text.split("").map((char, i) => {
          const progress = spring({
            frame,
            fps,
            delay: i * 3,
            config: { damping: 12, stiffness: 200 },
          });

          const rotateX = interpolate(progress, [0, 1], [90, 0]);
          const opacity = interpolate(progress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <span
              key={`${char}-${i}`}
              style={{
                color: "#ffffff",
                fontSize: 100,
                fontWeight: 900,
                display: "inline-block",
                transform: `rotateX(${rotateX}deg)`,
                opacity,
                textTransform: "uppercase",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CounterReveal: React.FC<{ from: number; to: number; suffix: string; label: string }> = ({
  from,
  to,
  suffix,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const value = Math.round(interpolate(progress, [0, 1], [from, to]));

  const scaleIn = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#10b981",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${scaleIn})` }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {value.toLocaleString()}
          {suffix}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 36,
            fontWeight: 500,
            marginTop: 16,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const KineticTypography: React.FC = () => {
  const { fps } = useVideoConfig();
  const sceneDuration = 2 * fps;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={sceneDuration} premountFor={fps}>
        <ScaleReveal text="Kinetic" />
      </Sequence>
      <Sequence from={sceneDuration} durationInFrames={sceneDuration} premountFor={fps}>
        <SplitReveal words={["MAKE", "IT", "MOVE"]} />
      </Sequence>
      <Sequence from={sceneDuration * 2} durationInFrames={sceneDuration} premountFor={fps}>
        <RotateIn text="Remotion" />
      </Sequence>
      <Sequence from={sceneDuration * 3} durationInFrames={sceneDuration} premountFor={fps}>
        <CounterReveal from={0} to={10000} suffix="+" label="Videos Generated" />
      </Sequence>
    </AbsoluteFill>
  );
};
