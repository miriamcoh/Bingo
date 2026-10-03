import { Composition } from "remotion";
import { FPS, TOTAL_FRAMES } from "./timing";
import { NetilatYadayim } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="NetilatYadayim"
      component={NetilatYadayim}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
