import { loadFont } from "@remotion/google-fonts/Inter";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const SCENES = [
  { bg: "#6366f1", label: "Fade", emoji: "1" },
  { bg: "#ec4899", label: "Slide", emoji: "2" },
  { bg: "#f59e0b", label: "Wipe", emoji: "3" },
  { bg: "#10b981", label: "Flip", emoji: "4" },
  { bg: "#8b5cf6", label: "Clock Wipe", emoji: "5" },
  { bg: "#ef4444", label: "Fin", emoji: "6" },
];

const Scene: React.FC<{ bg: string; label: string; index: string }> = ({
  bg,
  label,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 0.5 * fps], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          {index}
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 72,
            fontWeight: 700,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 24,
          }}
        >
          Transition Effect
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TRANSITION_DURATION = 20;
const SCENE_DURATION = 60;

export const TransitionsShowcase: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <Scene bg={SCENES[0].bg} label={SCENES[0].label} index={SCENES[0].emoji} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <Scene bg={SCENES[1].bg} label={SCENES[1].label} index={SCENES[1].emoji} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <Scene bg={SCENES[2].bg} label={SCENES[2].label} index={SCENES[2].emoji} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <Scene bg={SCENES[3].bg} label={SCENES[3].label} index={SCENES[3].emoji} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={flip()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <Scene bg={SCENES[4].bg} label={SCENES[4].label} index={SCENES[4].emoji} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={clockWipe({ width: 1920, height: 1080 })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <Scene bg={SCENES[5].bg} label={SCENES[5].label} index={SCENES[5].emoji} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
