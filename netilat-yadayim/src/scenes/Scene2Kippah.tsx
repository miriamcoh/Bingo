import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { add, blink, keyPt, keys, Pt, sub, tween } from "../anim";
import {
  BedBack,
  BedroomBackground,
  Blanket,
  Nightstand,
} from "../components/Bedroom";
import {
  Kid,
  Kippah,
  KIPPAH_ON_HEAD,
  KippahPose,
  REST_LEFT,
  REST_RIGHT,
} from "../components/Kid";
import { SpokenLineView } from "../components/Subtitle";
import { LINES, talkingMouth } from "../lines";
import {
  BED_KID_SCALE,
  bedKidTransform,
  KIPPAH_ON_DRESSER,
} from "./Scene1WakeUp";

const line = LINES.kippah;
const HIP_START = 1000;
const HIP_END = 1220;
const HIP_Y = 640;

// The kippah on the dresser, in the kid's coordinates (after he scoots over).
const KIPPAH_LOCAL: Pt = {
  x: (KIPPAH_ON_DRESSER.x - HIP_END) / BED_KID_SCALE,
  y: (KIPPAH_ON_DRESSER.y - HIP_Y) / BED_KID_SCALE - 120,
};
// Where the hand holds the kippah (its right edge).
const GRIP: Pt = { x: 26, y: -12 };

// Scene 2: he takes the kippah from the dresser, puts it on, and talks.
export const Scene2Kippah: React.FC = () => {
  const frame = useCurrentFrame();

  // scoot over toward the dresser with two little hops
  const scoot = tween(frame, [0, 25], [0, 1]);
  const hipX = HIP_START + (HIP_END - HIP_START) * scoot;
  const hipY = HIP_Y - Math.abs(Math.sin(scoot * Math.PI * 2)) * 14;

  const grab = add(KIPPAH_LOCAL, GRIP);
  const onHead = add(KIPPAH_ON_HEAD, GRIP);
  const leftHand = keyPt(frame, [
    [0, REST_LEFT],
    [25, REST_LEFT],
    [45, grab],
    [50, grab],
    [78, onHead],
    [86, onHead],
    [104, REST_LEFT],
  ]);

  // While talking he raises one finger, like a teacher.
  const wiggle = Math.sin(frame * 0.25) * 6;
  const rightHand = keyPt(frame, [
    [0, REST_RIGHT],
    [96, REST_RIGHT],
    [110, { x: -122, y: -300 }],
    [160, { x: -122, y: -300 }],
    [174, REST_RIGHT],
  ]);
  const talkingHand = {
    x: rightHand.x,
    y: rightHand.y + (frame > 110 && frame < 160 ? wiggle : 0),
  };

  let kippah: "head" | KippahPose | null = null;
  if (frame >= 80) {
    kippah = "head";
  } else if (frame >= 47) {
    const p = sub(leftHand, GRIP);
    kippah = {
      x: p.x,
      y: p.y,
      rotate: tween(frame, [50, 78], [0, KIPPAH_ON_HEAD.rotate]),
    };
  }

  const look = {
    x: keys(frame, [
      [10, 0],
      [22, 1],
      [60, 1],
      [70, 0.3],
      [88, 0],
    ]),
    y: keys(frame, [
      [55, 0],
      [70, -1],
      [84, -1],
      [92, 0],
    ]),
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFE9C7" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <BedroomBackground frame={frame + 135} sunY={285} />
        <Nightstand />
        {frame < 47 ? (
          <g
            transform={`translate(${KIPPAH_ON_DRESSER.x} ${KIPPAH_ON_DRESSER.y}) scale(${BED_KID_SCALE})`}
          >
            <Kippah x={0} y={0} rotate={0} />
          </g>
        ) : null}
        <BedBack />
        <g transform={bedKidTransform(hipX, hipY, 0)}>
          <Kid
            kippah={kippah}
            showLegs={false}
            eyesOpen={blink(frame, 30)}
            look={look}
            mouthOpen={talkingMouth(frame, line)}
            smile={0.8}
            rightHand={talkingHand}
            leftHand={leftHand}
          />
        </g>
        <Blanket endX={hipX + 85} />
      </svg>
      <SpokenLineView line={line} />
    </AbsoluteFill>
  );
};
