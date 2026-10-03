import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { add, blink, keyPt, keys, lerpPt, Pt, rotatePt, tween } from "../anim";
import {
  BathroomBackground,
  BOWL_RIM,
  Camera,
  Faucet,
  FAUCET_SPOUT,
  NATLA_ON_COUNTER,
  SinkFront,
  STAGE_TRANSFORM,
  Towel,
  TOWEL_HOOK,
  TowelHook,
  WIDE_SHOT,
} from "../components/Bathroom";
import { COLORS, Kid, REST_LEFT, REST_RIGHT } from "../components/Kid";
import {
  Natla,
  NATLA_GRIP_X,
  NATLA_GRIP_Y,
  NATLA_LIP_X,
  NATLA_LIP_Y,
} from "../components/Natla";
import { Drops, Stream } from "../components/Water";
import { fontFamily } from "../fonts";

// Where the camera zooms to (screen coordinates) and how much.
export const ZOOM_FOCUS: Pt = { x: 960, y: 756 };
export const ZOOM_IN = 2.2;

// Natla positions (stage coordinates).
const UNDER_FAUCET: Pt = { x: FAUCET_SPOUT.x, y: -168 };
const MIDDLE: Pt = { x: 0, y: -215 };

// Timeline (frames inside this scene).
const FILL_START = 52;
const FILL_END = 105;
const POURS_START = 122;
const POUR_LENGTH = 38;
const POURS = 6;
const POURS_END = POURS_START + POUR_LENGTH * POURS; // 350

// side +1 = the kid's left hand, -1 = the kid's right hand
const grip = (c: Pt, tilt: number, side: number) =>
  add(c, rotatePt({ x: side * NATLA_GRIP_X, y: NATLA_GRIP_Y }, tilt));
const lip = (c: Pt, tilt: number, side: number) =>
  add(c, rotatePt({ x: side * NATLA_LIP_X, y: NATLA_LIP_Y }, tilt));

type Pose = {
  center: Pt;
  tilt: number;
  right: Pt;
  left: Pt;
  pour: null | {
    index: number;
    t: number;
    washedSide: number;
    from: Pt;
    hand: Pt;
  };
};

// Where the natla and both hands are at a given frame.
const getPose = (frame: number): Pose => {
  if (frame >= POURS_START && frame < POURS_END) {
    const index = Math.floor((frame - POURS_START) / POUR_LENGTH);
    const t = frame - POURS_START - index * POUR_LENGTH;
    // Pour on the RIGHT hand first: the LEFT hand (+1) holds the natla.
    const side = index % 2 === 0 ? 1 : -1;
    const p = keys(t, [
      [0, 0],
      [10, 1],
      [28, 1],
      [38, 0],
    ]);
    const center = lerpPt(MIDDLE, { x: side * 58, y: -228 }, p);
    const tilt = -side * 60 * p;
    const holder = grip(center, tilt, side);
    const washed = lerpPt(grip(MIDDLE, 0, -side), { x: -side * 4, y: -180 }, p);
    return {
      center,
      tilt,
      right: side === 1 ? washed : holder,
      left: side === 1 ? holder : washed,
      pour: {
        index,
        t,
        washedSide: -side,
        from: lip(center, tilt, -side),
        hand: washed,
      },
    };
  }

  // Before and after the pours, both hands hold the natla by its handles.
  const center = keyPt(frame, [
    [30, NATLA_ON_COUNTER],
    [50, UNDER_FAUCET],
    [FILL_END, UNDER_FAUCET],
    [POURS_START, MIDDLE],
    [POURS_END, MIDDLE],
    [POURS_END + 16, NATLA_ON_COUNTER],
  ]);
  let right = grip(center, 0, -1);
  let left = grip(center, 0, 1);
  if (frame < 30) {
    const reach = tween(frame, [10, 30], [0, 1]);
    right = lerpPt(REST_RIGHT, right, reach);
    left = lerpPt(REST_LEFT, left, reach);
  }
  if (frame > POURS_END + 16) {
    const release = tween(frame, [POURS_END + 16, POURS_END + 30], [0, 1]);
    right = lerpPt(right, { x: -46, y: -178 }, release);
    left = lerpPt(left, { x: 46, y: -178 }, release);
  }
  return { center, tilt: 0, right, left, pour: null };
};

const CountBadge: React.FC<{
  x: number;
  y: number;
  count: number;
  label: string;
  scale: number;
  opacity: number;
}> = ({ x, y, count, label, scale, opacity }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <circle r={27} fill="#FFFFFF" stroke="#FF6B2C" strokeWidth={4} />
    <text
      y={11}
      textAnchor="middle"
      fontFamily={fontFamily}
      fontWeight={800}
      fontSize={32}
      fill="#FF6B2C"
    >
      {count}
    </text>
    <foreignObject x={-50} y={30} width={100} height={30}>
      <div
        style={{
          direction: "rtl",
          textAlign: "right",
          fontFamily,
          fontWeight: 700,
          fontSize: 14,
          color: COLORS.outline,
          background: "#FFF3B0",
          borderRadius: 10,
          padding: "1px 8px",
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        {label}
      </div>
    </foreignObject>
  </g>
);

// Scene 4: zoom in, fill the natla, pour 3 times on each hand, alternating.
export const Scene4Washing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
  });
  const zoom = WIDE_SHOT.zoom + (ZOOM_IN - WIDE_SHOT.zoom) * zoomP;
  const focus = lerpPt(WIDE_SHOT.focus, ZOOM_FOCUS, zoomP);

  const pose = getPose(frame);

  // water inside the natla
  const filled = tween(frame, [FILL_START + 3, FILL_END], [0, 1]);
  const poured = pose.pour
    ? pose.pour.index + tween(pose.pour.t, [10, 28], [0, 1])
    : frame >= POURS_END
      ? POURS
      : 0;
  const water = filled * (1 - (poured / POURS) * 0.9);

  // faucet stream while filling
  const lever = keys(frame, [
    [FILL_START - 4, 0],
    [FILL_START, 1],
    [FILL_END - 3, 1],
    [FILL_END + 1, 0],
  ]);
  const spoutEnd = { x: FAUCET_SPOUT.x, y: FAUCET_SPOUT.y + 4 };
  const natlaTop = { x: UNDER_FAUCET.x, y: UNDER_FAUCET.y - 30 };
  const faucetGrow = tween(frame, [FILL_START, FILL_START + 4], [0, 1]);
  const faucetShrink = tween(frame, [FILL_END - 3, FILL_END], [0, 1]);

  const pour = pose.pour;
  const handTop = pour ? { x: pour.hand.x, y: pour.hand.y - 15 } : null;

  return (
    <AbsoluteFill style={{ backgroundColor: "#BDE6E8" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <Camera zoom={zoom} focus={focus}>
          <BathroomBackground />
          <g transform={STAGE_TRANSFORM}>
            <Towel anchor={TOWEL_HOOK} />
            <TowelHook />
            <Kid
              eyesOpen={blink(frame, 20)}
              look={{ x: pour ? pour.washedSide * 0.5 : 0, y: 1 }}
              smile={0.5}
              rightHand={pose.right}
              leftHand={pose.left}
            />
            {pour && handTop ? (
              <Drops
                origin={{ x: pour.hand.x, y: pour.hand.y + 12 }}
                fall={BOWL_RIM - pour.hand.y - 8}
                spread={40}
                frame={frame}
                seed={`hand-${pour.index}`}
                count={12}
                period={14}
                size={5}
                amount={keys(pour.t, [
                  [11, 0],
                  [14, 1],
                  [30, 1],
                  [37, 0],
                ])}
              />
            ) : null}
            {frame > POURS_END ? (
              <>
                <Drops
                  origin={{ x: pose.right.x, y: pose.right.y + 12 }}
                  fall={40}
                  spread={10}
                  frame={frame}
                  seed="after-r"
                  count={3}
                  period={22}
                  size={3}
                />
                <Drops
                  origin={{ x: pose.left.x, y: pose.left.y + 12 }}
                  fall={40}
                  spread={10}
                  frame={frame}
                  seed="after-l"
                  count={3}
                  period={22}
                  size={3}
                />
              </>
            ) : null}
            <SinkFront />
            <Faucet lever={lever} />
            {frame >= FILL_START && frame <= FILL_END ? (
              <Stream
                from={lerpPt(spoutEnd, natlaTop, faucetShrink)}
                to={lerpPt(spoutEnd, natlaTop, faucetGrow)}
                width={8}
                frame={frame}
              />
            ) : null}
            <g
              transform={`translate(${pose.center.x} ${pose.center.y}) rotate(${pose.tilt})`}
            >
              <Natla water={water} />
            </g>
            {frame >= FILL_START + 4 && frame <= FILL_END ? (
              <Drops
                origin={{ x: natlaTop.x, y: natlaTop.y - 4 }}
                fall={-16}
                spread={50}
                frame={frame}
                seed="fill-splash"
                count={5}
                period={10}
                size={2.5}
              />
            ) : null}
            {pour && handTop && pour.t >= 10 && pour.t <= 28 ? (
              <Stream
                from={lerpPt(
                  pour.from,
                  handTop,
                  tween(pour.t, [24, 28], [0, 1]),
                )}
                to={lerpPt(pour.from, handTop, tween(pour.t, [10, 14], [0, 1]))}
                width={7}
                frame={frame}
              />
            ) : null}
            {pour ? (
              <CountBadge
                x={pour.washedSide * 205}
                y={-300}
                count={Math.floor(pour.index / 2) + 1}
                label={pour.washedSide === -1 ? "יד ימין" : "יד שמאל"}
                scale={
                  1.7 *
                  spring({ frame: pour.t - 9, fps, config: { damping: 10 } })
                }
                opacity={keys(pour.t, [
                  [30, 1],
                  [37, 0],
                ])}
              />
            ) : null}
          </g>
        </Camera>
      </svg>
    </AbsoluteFill>
  );
};
