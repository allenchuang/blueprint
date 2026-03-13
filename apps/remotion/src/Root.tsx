import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { AeirDataViz } from "./AeirDataViz";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AeirDataViz"
        component={AeirDataViz}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
