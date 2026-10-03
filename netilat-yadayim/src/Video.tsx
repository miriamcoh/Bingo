import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1WakeUp } from "./scenes/Scene1WakeUp";
import { Scene2Kippah } from "./scenes/Scene2Kippah";
import { Scene3Walk } from "./scenes/Scene3Walk";
import { Scene4Washing } from "./scenes/Scene4Washing";
import { Scene5Bracha } from "./scenes/Scene5Bracha";
import { Scene6Goodbye } from "./scenes/Scene6Goodbye";
import { FADE, SCENES, TOTAL_FRAMES } from "./timing";

const Fade = () => (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: FADE })}
  />
);

// The main video: all the scenes in order, with soft fades between them.
export const NetilatYadayim: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(
    frame,
    [TOTAL_FRAMES - 15, TOTAL_FRAMES - 1],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#FFF6E5" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.wakeUp}>
          <Scene1WakeUp />
        </TransitionSeries.Sequence>
        {Fade()}
        <TransitionSeries.Sequence durationInFrames={SCENES.kippah}>
          <Scene2Kippah />
        </TransitionSeries.Sequence>
        {Fade()}
        <TransitionSeries.Sequence durationInFrames={SCENES.walk}>
          <Scene3Walk />
        </TransitionSeries.Sequence>
        {Fade()}
        <TransitionSeries.Sequence durationInFrames={SCENES.washing}>
          <Scene4Washing />
        </TransitionSeries.Sequence>
        {Fade()}
        <TransitionSeries.Sequence durationInFrames={SCENES.bracha}>
          <Scene5Bracha />
        </TransitionSeries.Sequence>
        {Fade()}
        <TransitionSeries.Sequence durationInFrames={SCENES.goodbye}>
          <Scene6Goodbye />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <AbsoluteFill style={{ backgroundColor: "#FFF6E5", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
