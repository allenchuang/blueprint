import { Composition, Folder } from "remotion";

import { HelloWorld } from "./HelloWorld";
import { AeirDataViz } from "./AeirDataViz";
import { SpringPhysics } from "./SpringPhysics";
import { EasingCurves } from "./EasingCurves";
import { TypewriterText } from "./TypewriterText";
import { WordHighlight } from "./WordHighlight";
import { StaggeredList } from "./StaggeredList";
import { TransitionsShowcase } from "./TransitionsShowcase";
import { AnimatedBarChart } from "./AnimatedBarChart";
import { LinePathAnimation } from "./LinePathAnimation";
import { PieChartAnimation } from "./PieChartAnimation";
import { KineticTypography } from "./KineticTypography";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AeirDataViz"
        component={AeirDataViz}
        durationInFrames={240}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      <Folder name="Animation-Skills">
        <Folder name="Timing">
          <Composition
            id="SpringPhysics"
            component={SpringPhysics}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
          <Composition
            id="EasingCurves"
            component={EasingCurves}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        </Folder>

        <Folder name="Text">
          <Composition
            id="TypewriterText"
            component={TypewriterText}
            durationInFrames={6 * FPS}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
          <Composition
            id="WordHighlight"
            component={WordHighlight}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
          <Composition
            id="KineticTypography"
            component={KineticTypography}
            durationInFrames={8 * FPS}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        </Folder>

        <Folder name="Entrances">
          <Composition
            id="StaggeredList"
            component={StaggeredList}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
          <Composition
            id="TransitionsShowcase"
            component={TransitionsShowcase}
            durationInFrames={260}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        </Folder>

        <Folder name="Data-Visualization">
          <Composition
            id="AnimatedBarChart"
            component={AnimatedBarChart}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
          <Composition
            id="LinePathAnimation"
            component={LinePathAnimation}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
          <Composition
            id="PieChartAnimation"
            component={PieChartAnimation}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        </Folder>
      </Folder>
    </>
  );
};
