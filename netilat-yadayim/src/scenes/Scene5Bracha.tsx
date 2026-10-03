import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { blink, keyPt, keys, lerpPt, Pt } from "../anim";
import {
  BathroomBackground,
  Camera,
  Faucet,
  NATLA_ON_COUNTER,
  SinkFront,
  STAGE_TRANSFORM,
  Towel,
  TOWEL_HOOK,
  TowelHook,
  WIDE_SHOT,
} from "../components/Bathroom";
import { Kid } from "../components/Kid";
import { Natla } from "../components/Natla";
import { SpokenLineView } from "../components/Subtitle";
import { Drops } from "../components/Water";
import { LINES, talkingMouth } from "../lines";
import { ZOOM_FOCUS, ZOOM_IN } from "./Scene4Washing";

const line = LINES.bracha;
const WET_RIGHT: Pt = { x: -46, y: -178 };
const WET_LEFT: Pt = { x: 46, y: -178 };
const UP_RIGHT: Pt = { x: -110, y: -392 };
const UP_LEFT: Pt = { x: 110, y: -392 };

// Scene 5: zoom out, hands up, and the bracha.
export const Scene5Bracha: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 35,
  });
  const zoom = ZOOM_IN + (WIDE_SHOT.zoom - ZOOM_IN) * out;
  const focus = lerpPt(ZOOM_FOCUS, WIDE_SHOT.focus, out);

  const sway = Math.sin(frame * 0.08) * 6;
  const up = keys(frame, [
    [24, 0],
    [46, 1],
    [234, 1],
    [252, 0],
  ]);
  const rightHand = lerpPt(
    WET_RIGHT,
    { x: UP_RIGHT.x + sway, y: UP_RIGHT.y },
    up,
  );
  const leftHand = lerpPt(WET_LEFT, { x: UP_LEFT.x + sway, y: UP_LEFT.y }, up);

  const drip = keys(frame, [
    [0, 1],
    [150, 1],
    [200, 0],
  ]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#BDE6E8" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <Camera zoom={zoom} focus={focus}>
          <BathroomBackground />
          <g transform={STAGE_TRANSFORM}>
            <Towel anchor={TOWEL_HOOK} />
            <TowelHook />
            <Kid
              eyesOpen={blink(frame, 70)}
              look={keyPt(frame, [
                [20, { x: 0, y: 1 }],
                [40, { x: 0, y: -0.6 }],
                [60, { x: 0, y: 0 }],
              ])}
              smile={0.7}
              mouthOpen={talkingMouth(frame, line)}
              rightHand={rightHand}
              leftHand={leftHand}
            />
            <Drops
              origin={{ x: rightHand.x, y: rightHand.y + 14 }}
              fall={60}
              spread={12}
              frame={frame}
              seed="b-r"
              count={3}
              period={26}
              size={3}
              amount={drip}
            />
            <Drops
              origin={{ x: leftHand.x, y: leftHand.y + 14 }}
              fall={60}
              spread={12}
              frame={frame}
              seed="b-l"
              count={3}
              period={26}
              size={3}
              amount={drip}
            />
            <SinkFront />
            <Faucet lever={0} />
            <g
              transform={`translate(${NATLA_ON_COUNTER.x} ${NATLA_ON_COUNTER.y})`}
            >
              <Natla water={0.1} />
            </g>
          </g>
        </Camera>
      </svg>
      <SpokenLineView line={line} />
    </AbsoluteFill>
  );
};
