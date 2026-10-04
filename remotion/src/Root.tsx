import { Composition } from "remotion";
import { HelloGoXpert } from "./HelloGoXpert";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HelloGoXpert"
      component={HelloGoXpert}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
