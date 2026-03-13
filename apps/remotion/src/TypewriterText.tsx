import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const COLOR_BG = "#0a0a0a";
const COLOR_TEXT = "#ffffff";
const FULL_TEXT = "Build videos programmatically. Ship them at scale.";
const PAUSE_AFTER = "Build videos programmatically.";
const FONT_SIZE = 64;
const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;
const PAUSE_SECONDS = 1;

const getTypedText = ({
  frame,
  fullText,
  pauseAfter,
  charFrames,
  pauseFrames,
}: {
  frame: number;
  fullText: string;
  pauseAfter: string;
  charFrames: number;
  pauseFrames: number;
}): string => {
  const pauseIndex = fullText.indexOf(pauseAfter);
  const preLen =
    pauseIndex >= 0 ? pauseIndex + pauseAfter.length : fullText.length;

  if (frame < preLen * charFrames) {
    return fullText.slice(0, Math.floor(frame / charFrames));
  }

  if (frame < preLen * charFrames + pauseFrames) {
    return fullText.slice(0, preLen);
  }

  const postPhase = frame - preLen * charFrames - pauseFrames;
  const typedChars = Math.min(
    fullText.length,
    preLen + Math.floor(postPhase / charFrames),
  );
  return fullText.slice(0, typedChars);
};

const Cursor: React.FC<{ frame: number; blinkFrames: number }> = ({
  frame,
  blinkFrames,
}) => {
  const opacity = interpolate(
    frame % blinkFrames,
    [0, blinkFrames / 2, blinkFrames],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <span style={{ opacity, color: "#6366f1" }}>{"\u258C"}</span>;
};

export const TypewriterText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pauseFrames = Math.round(fps * PAUSE_SECONDS);
  const typedText = getTypedText({
    frame,
    fullText: FULL_TEXT,
    pauseAfter: PAUSE_AFTER,
    charFrames: CHAR_FRAMES,
    pauseFrames,
  });

  const bgGlow = interpolate(frame, [0, 30], [0, 0.15], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR_BG,
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(99,102,241,${bgGlow}) 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          color: COLOR_TEXT,
          fontSize: FONT_SIZE,
          fontWeight: 700,
          fontFamily,
          lineHeight: 1.4,
          textAlign: "center",
          position: "relative",
        }}
      >
        <span>{typedText}</span>
        <Cursor frame={frame} blinkFrames={CURSOR_BLINK_FRAMES} />
      </div>
    </AbsoluteFill>
  );
};
