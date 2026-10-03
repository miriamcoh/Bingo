import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { blink, keyPt, keys, Pt, tween } from "../anim";
import {
  BedBack,
  BedroomBackground,
  Blanket,
  Nightstand,
} from "../components/Bedroom";
import { Kid, Kippah, REST_LEFT, REST_RIGHT } from "../components/Kid";
import { fontFamily } from "../fonts";

// Shared by scene 1 and 2: where the kid is in the bedroom.
export const BED_KID_SCALE = 1.15;
export const KIPPAH_ON_DRESSER = { x: 1450, y: 517 };

// Kid transform in the bed: (hipX, hipY) is his hip; `rot` 90 = lying down.
export const bedKidTransform = (hipX: number, hipY: number, rot: number) =>
  `translate(${hipX} ${hipY}) rotate(${rot}) scale(${BED_KID_SCALE}) translate(0 120)`;

const LYING_RIGHT: Pt = { x: -28, y: -178 };
const LYING_LEFT: Pt = { x: 26, y: -162 };
const STRETCH_RIGHT: Pt = { x: -108, y: -392 };
const STRETCH_LEFT: Pt = { x: 108, y: -392 };

// Scene 1: morning, the kid wakes up and sits up in bed.
export const Scene1WakeUp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sitUp = spring({
    frame: frame - 55,
    fps,
    config: { damping: 15, mass: 0.9 },
  });
  const rot = 90 * (1 - sitUp);
  const hipX = 1000;
  const hipY = 612 + 28 * sitUp;

  const eyesOpen =
    interpolate(
      frame,
      [0, 30, 38, 46, 49, 52, 62, 66, 84, 90],
      [0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
      { extrapolateRight: "clamp" },
    ) * (frame > 100 ? blink(frame) : 1);

  const yawn = keys(frame, [
    [62, 0],
    [68, 0.95],
    [82, 0.95],
    [90, 0],
  ]);

  const rightHand = keyPt(frame, [
    [0, LYING_RIGHT],
    [58, LYING_RIGHT],
    [72, STRETCH_RIGHT],
    [84, STRETCH_RIGHT],
    [100, REST_RIGHT],
  ]);
  const leftHand = keyPt(frame, [
    [0, LYING_LEFT],
    [58, LYING_LEFT],
    [72, STRETCH_LEFT],
    [84, STRETCH_LEFT],
    [100, REST_LEFT],
  ]);

  // "Z z z" while sleeping
  const zOpacity = tween(frame, [26, 40], [1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFE9C7" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <BedroomBackground
          frame={frame}
          sunY={tween(frame, [0, 135], [470, 285])}
        />
        <Nightstand />
        <g
          transform={`translate(${KIPPAH_ON_DRESSER.x} ${KIPPAH_ON_DRESSER.y}) scale(${BED_KID_SCALE})`}
        >
          <Kippah x={0} y={0} rotate={0} />
        </g>
        <BedBack />
        <g transform={bedKidTransform(hipX, hipY, rot)}>
          <Kid
            kippah={null}
            showLegs={false}
            eyesOpen={eyesOpen}
            mouthOpen={yawn}
            smile={frame > 92 ? 0.8 : 0.3}
            look={{ x: tween(frame, [104, 112], [0, 1]), y: 0 }}
            rightHand={rightHand}
            leftHand={leftHand}
          />
        </g>
        <Blanket endX={hipX + 85} />
        {zOpacity > 0
          ? [0, 1, 2].map((i) => {
              const t = (frame + i * 12) % 36;
              return (
                <text
                  key={i}
                  x={1250 - t * 2 - i * 20}
                  y={520 - t * 3 - i * 30}
                  fontFamily={fontFamily}
                  fontWeight={800}
                  fontSize={40 + i * 12}
                  fill="#7A6BC8"
                  opacity={
                    zOpacity * interpolate(t, [0, 8, 30, 36], [0, 1, 1, 0])
                  }
                >
                  Z
                </text>
              );
            })
          : null}
      </svg>
    </AbsoluteFill>
  );
};
