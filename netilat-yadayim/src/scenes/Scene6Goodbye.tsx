import React from "react";
import {
  AbsoluteFill,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { add, blink, keyPt, keys, lerpPt, Pt, tween } from "../anim";
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
import { COLORS, Kid, REST_LEFT, REST_RIGHT } from "../components/Kid";
import { Natla } from "../components/Natla";
import { SpokenLineView } from "../components/Subtitle";
import { LINES, talkingMouth } from "../lines";

const line = LINES.goodbye;
const HOOK_GRIP: Pt = add(TOWEL_HOOK, { x: 0, y: 12 });
const WET_RIGHT: Pt = { x: -46, y: -178 };
const WET_LEFT: Pt = { x: 46, y: -178 };

const Sparkle: React.FC<{
  x: number;
  y: number;
  size: number;
  rotate: number;
}> = ({ x, y, size, rotate }) => (
  <path
    d="M 0 -20 Q 3 -3 20 0 Q 3 3 0 20 Q -3 3 -20 0 Q -3 -3 0 -20 Z"
    transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size})`}
    fill="#FFD84D"
    stroke={COLORS.outline}
    strokeWidth={2}
  />
);

// Scene 6: dry the hands, smile, wave and say goodbye.
export const Scene6Goodbye: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1) take the towel, 2) rub, 3) hang it back, 4) wave
  const rubbing = frame >= 36 && frame < 86;
  const rub = Math.sin(frame * 0.7);
  let leftHand = keyPt(frame, [
    [0, WET_LEFT],
    [20, HOOK_GRIP],
    [24, HOOK_GRIP],
    [36, { x: 28, y: -190 }],
    [86, { x: 28, y: -190 }],
    [102, HOOK_GRIP],
    [106, HOOK_GRIP],
    [122, REST_LEFT],
  ]);
  let rightHand = keyPt(frame, [
    [0, WET_RIGHT],
    [36, { x: -28, y: -190 }],
    [86, { x: -28, y: -190 }],
    [100, REST_RIGHT],
  ]);
  if (rubbing) {
    const amount = keys(frame, [
      [36, 0],
      [42, 1],
      [80, 1],
      [86, 0],
    ]);
    rightHand = add(rightHand, {
      x: rub * 12 * amount,
      y: Math.cos(frame * 0.7) * 6 * amount,
    });
    leftHand = add(leftHand, {
      x: -rub * 12 * amount,
      y: -Math.cos(frame * 0.7) * 6 * amount,
    });
  }

  // wave with the right hand
  const waveIn = keys(frame, [
    [104, 0],
    [118, 1],
  ]);
  if (frame > 104) {
    const wave = { x: -125 + Math.sin((frame - 104) * 0.4) * 24, y: -372 };
    rightHand = lerpPt(REST_RIGHT, wave, waveIn);
  }

  // towel: hanging -> in the hands -> back on the hook
  const inHands = frame >= 24 && frame < 102;
  const toMiddle = tween(frame, [26, 38], [0, 1]);
  const toHook = tween(frame, [86, 100], [0, 1]);
  const middle = {
    x: (leftHand.x + rightHand.x) / 2,
    y: (leftHand.y + rightHand.y) / 2 - 22,
  };
  const carry = { x: leftHand.x, y: leftHand.y - 12 };
  const towelAnchor = inHands
    ? lerpPt(lerpPt(carry, middle, toMiddle), carry, toHook)
    : TOWEL_HOOK;
  const squash = inHands ? 1 - 0.45 * toMiddle * (1 - toHook) : 1;

  const happy = frame > 100;

  return (
    <AbsoluteFill style={{ backgroundColor: "#BDE6E8" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <Camera zoom={WIDE_SHOT.zoom} focus={WIDE_SHOT.focus}>
          <BathroomBackground />
          <g transform={STAGE_TRANSFORM}>
            {inHands ? null : <Towel anchor={TOWEL_HOOK} />}
            <TowelHook />
            <Kid
              eyesOpen={blink(frame, 10)}
              look={{ x: 0, y: rubbing ? 1 : 0 }}
              smile={happy ? 1 : 0.7}
              mouthOpen={talkingMouth(frame, line)}
              rightHand={rightHand}
              leftHand={leftHand}
            />
            <SinkFront />
            <Faucet lever={0} />
            <g
              transform={`translate(${NATLA_ON_COUNTER.x} ${NATLA_ON_COUNTER.y})`}
            >
              <Natla water={0.1} />
            </g>
            {inHands ? (
              <Towel
                anchor={towelAnchor}
                squash={squash}
                rotate={rubbing ? rub * 4 : 0}
              />
            ) : null}
            {happy
              ? Array.from({ length: 10 }, (_, i) => {
                  const angle = random(`spark-a-${i}`) * Math.PI * 2;
                  const dist = 230 + random(`spark-d-${i}`) * 120;
                  const pop = spring({
                    frame: frame - 104 - i * 4,
                    fps,
                    config: { damping: 9 },
                  });
                  const twinkle = 0.75 + 0.25 * Math.sin(frame * 0.3 + i);
                  return (
                    <Sparkle
                      key={i}
                      x={Math.cos(angle) * dist}
                      y={-280 + Math.sin(angle) * dist * 0.6}
                      size={
                        pop * twinkle * (0.6 + random(`spark-s-${i}`) * 0.6)
                      }
                      rotate={frame * 2 + i * 30}
                    />
                  );
                })
              : null}
          </g>
        </Camera>
      </svg>
      <SpokenLineView line={line} />
    </AbsoluteFill>
  );
};
