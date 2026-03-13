import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0D9373",
      }}
    >
      <h1
        style={{
          fontSize: 80,
          fontWeight: "bold",
          color: "white",
          opacity,
        }}
      >
        Mastermind
      </h1>
    </AbsoluteFill>
  );
};
