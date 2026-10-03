import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { blink, tween } from "../anim";
import {
  BathroomBackground,
  Camera,
  Faucet,
  NATLA_ON_COUNTER,
  SinkFront,
  STAGE,
  STAGE_TRANSFORM,
  Towel,
  TOWEL_HOOK,
  TowelHook,
  WIDE_SHOT,
} from "../components/Bathroom";
import { Kid, REST_LEFT, REST_RIGHT } from "../components/Kid";
import { Natla } from "../components/Natla";

const START_X = 120;
const WALK_END = 80;
const STRIDE = 38; // screen pixels per half step

// Scene 3: the kid walks to the sink.
export const Scene3Walk: React.FC = () => {
  const frame = useCurrentFrame();

  const x = tween(frame, [0, WALK_END], [START_X, STAGE.x]);
  // how fast he is moving right now (0..1), so the legs slow down at the end
  const speed = Math.min(
    1,
    Math.abs(tween(frame + 1, [0, WALK_END], [START_X, STAGE.x]) - x) / 12,
  );
  const phase = (x - START_X) / STRIDE;
  const legSwing = Math.sin(phase) * 24 * speed;
  const bob = -Math.abs(Math.sin(phase)) * 9 * speed;
  const armSwing = Math.sin(phase) * 16 * speed;

  return (
    <AbsoluteFill style={{ backgroundColor: "#BDE6E8" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <Camera zoom={WIDE_SHOT.zoom} focus={WIDE_SHOT.focus}>
          <BathroomBackground />
          <g transform={STAGE_TRANSFORM}>
            <Towel anchor={TOWEL_HOOK} />
            <TowelHook />
          </g>
          <g
            transform={`translate(${x} ${STAGE.y + bob}) rotate(${speed * 3}) scale(${STAGE.scale})`}
          >
            <Kid
              legSwing={legSwing}
              eyesOpen={blink(frame, 50)}
              look={{
                x: tween(frame, [60, 85], [1, 0.5]),
                y: tween(frame, [70, 90], [0, 0.6]),
              }}
              smile={0.8}
              rightHand={{
                x: REST_RIGHT.x + armSwing,
                y: REST_RIGHT.y - Math.abs(armSwing) * 0.5,
              }}
              leftHand={{
                x: REST_LEFT.x - armSwing,
                y: REST_LEFT.y - Math.abs(armSwing) * 0.5,
              }}
            />
          </g>
          <g transform={STAGE_TRANSFORM}>
            <SinkFront />
            <Faucet lever={0} />
            <g
              transform={`translate(${NATLA_ON_COUNTER.x} ${NATLA_ON_COUNTER.y})`}
            >
              <Natla water={0} />
            </g>
          </g>
        </Camera>
      </svg>
    </AbsoluteFill>
  );
};
