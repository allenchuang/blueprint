import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const SENTENCES = [
  { text: "Design is not just what it looks like.", highlight: "looks like", color: "#6366f1" },
  { text: "Design is how it works.", highlight: "works", color: "#ec4899" },
];

const Highlight: React.FC<{
  word: string;
  color: string;
  delay: number;
}> = ({ word, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleX = spring({
    fps,
    frame,
    config: { damping: 200 },
    delay,
    durationInFrames: 18,
  });

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: -4,
          right: -4,
          top: "50%",
          height: "1.1em",
          transform: `translateY(-50%) scaleX(${Math.min(1, scaleX)})`,
          transformOrigin: "left center",
          backgroundColor: color,
          borderRadius: "0.15em",
          zIndex: 0,
          opacity: 0.3,
        }}
      />
      <span style={{ position: "relative", zIndex: 1, color }}>{word}</span>
    </span>
  );
};

const AnimatedSentence: React.FC<{
  text: string;
  highlight: string;
  color: string;
  startFrame: number;
  highlightDelay: number;
}> = ({ text, highlight, color, startFrame, highlightDelay }) => {
  const frame = useCurrentFrame();

  const highlightIndex = text.indexOf(highlight);
  const hasHighlight = highlightIndex >= 0;
  const preText = hasHighlight ? text.slice(0, highlightIndex) : text;
  const postText = hasHighlight
    ? text.slice(highlightIndex + highlight.length)
    : "";

  const opacity = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame - startFrame, [0, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontSize: 56,
        fontWeight: 700,
        color: "#ffffff",
        opacity,
        transform: `translateY(${translateY}px)`,
        lineHeight: 1.5,
      }}
    >
      {hasHighlight ? (
        <>
          <span>{preText}</span>
          <Highlight
            word={highlight}
            color={color}
            delay={highlightDelay}
          />
          <span>{postText}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export const WordHighlight: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          textAlign: "center",
        }}
      >
        {SENTENCES.map((s, i) => (
          <AnimatedSentence
            key={s.text}
            text={s.text}
            highlight={s.highlight}
            color={s.color}
            startFrame={i * 50}
            highlightDelay={i * 50 + 30}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
