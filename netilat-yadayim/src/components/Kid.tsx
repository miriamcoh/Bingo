import React from "react";
import { Pt } from "../anim";

// ---------------------------------------------------------------
// The kid. Drawn in his own coordinate system:
//   (0, 0) is between his feet, negative y goes up.
//   He is about 440 units tall. Scenes place and scale him with a
//   <g transform="..."> around <Kid />.
// "Right hand" = the kid's own right hand (on the LEFT of the screen,
// because he faces us).
// ---------------------------------------------------------------

export const COLORS = {
  skin: "#FFD9B8",
  skinShade: "#F2B48E",
  outline: "#6B3E2E",
  pajama: "#9AD6F5",
  pajamaDark: "#5FB4E3",
  pajamaLight: "#E4F6FF",
  hair: "#7A4A2A",
  hairDark: "#5A321A",
  cheek: "#FF8E8E",
  eye: "#2B1B17",
  mouth: "#8B2E3A",
  tongue: "#FF8A8A",
};

const SHOULDER_X = 50;
const SHOULDER_Y = -240;
const UPPER_ARM = 92;
const FOREARM = 92;

export const REST_RIGHT: Pt = { x: -84, y: -100 };
export const REST_LEFT: Pt = { x: 84, y: -100 };

export type KippahPose = { x: number; y: number; rotate: number };
export const KIPPAH_ON_HEAD: KippahPose = { x: 4, y: -406, rotate: -6 };

export type KidProps = {
  rightHand?: Pt;
  leftHand?: Pt;
  eyesOpen?: number; // 0 closed .. 1 open
  look?: Pt; // where the pupils look, each axis -1..1
  mouthOpen?: number; // 0..1 (talking / yawning)
  smile?: number; // 0..1
  headTilt?: number; // degrees
  // "head" = kippah on his head, a pose = held somewhere, null = none
  kippah?: "head" | KippahPose | null;
  showLegs?: boolean;
  legSwing?: number; // degrees, for walking
};

// ---------- the kippah (used on the head, in the hand, on the dresser)
export const Kippah: React.FC<KippahPose> = ({ x, y, rotate }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <path
      d="M -38 0 C -36 -24 -18 -30 0 -30 C 18 -30 36 -24 38 0 Q 0 8 -38 0 Z"
      fill="#2C4A9A"
      stroke={COLORS.outline}
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path
      d="M -35 -6 Q 0 2 35 -6"
      stroke="#F7C948"
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
    <circle cx={-17} cy={-17} r={3} fill="#F7C948" />
    <circle cx={0} cy={-21} r={3} fill="#F7C948" />
    <circle cx={17} cy={-17} r={3} fill="#F7C948" />
  </g>
);

// ---------- arms: we give a hand target and solve the elbow (simple IK)
const solveArm = (side: -1 | 1, target: Pt) => {
  const s = { x: side * SHOULDER_X, y: SHOULDER_Y };
  const dx = target.x - s.x;
  const dy = target.y - s.y;
  const dist = Math.min(
    UPPER_ARM + FOREARM - 0.5,
    Math.max(20, Math.hypot(dx, dy)),
  );
  const base = Math.atan2(dy, dx);
  const cosA =
    (UPPER_ARM * UPPER_ARM + dist * dist - FOREARM * FOREARM) /
    (2 * UPPER_ARM * dist);
  const a = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const e1 = {
    x: s.x + UPPER_ARM * Math.cos(base + a),
    y: s.y + UPPER_ARM * Math.sin(base + a),
  };
  const e2 = {
    x: s.x + UPPER_ARM * Math.cos(base - a),
    y: s.y + UPPER_ARM * Math.sin(base - a),
  };
  // Elbows always point outwards, away from the body.
  const elbow = side * e1.x > side * e2.x ? e1 : e2;
  const hand = {
    x: s.x + dist * Math.cos(base),
    y: s.y + dist * Math.sin(base),
  };
  return { s, elbow, hand };
};

const Arm: React.FC<{ side: -1 | 1; target: Pt }> = ({ side, target }) => {
  const { s, elbow, hand } = solveArm(side, target);
  const angle = Math.atan2(hand.y - elbow.y, hand.x - elbow.x);
  const deg = (angle * 180) / Math.PI;
  const wrist = {
    x: hand.x - 14 * Math.cos(angle),
    y: hand.y - 14 * Math.sin(angle),
  };
  const d = `M ${s.x} ${s.y} L ${elbow.x} ${elbow.y} L ${wrist.x} ${wrist.y}`;
  return (
    <g>
      <path
        d={d}
        stroke={COLORS.outline}
        strokeWidth={34}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        stroke={COLORS.pajama}
        strokeWidth={26}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={wrist.x}
        cy={wrist.y}
        r={13}
        fill={COLORS.pajamaLight}
        stroke={COLORS.outline}
        strokeWidth={3.5}
      />
      {/* hand: local +y points from wrist to fingertips */}
      <g transform={`translate(${hand.x} ${hand.y}) rotate(${deg - 90})`}>
        <ellipse
          cx={-side * 13}
          cy={-2}
          rx={6.5}
          ry={10}
          transform={`rotate(${-side * 25} ${-side * 13} -2)`}
          fill={COLORS.skin}
          stroke={COLORS.outline}
          strokeWidth={3.5}
        />
        <ellipse
          cx={0}
          cy={3}
          rx={15}
          ry={18}
          fill={COLORS.skin}
          stroke={COLORS.outline}
          strokeWidth={3.5}
        />
      </g>
    </g>
  );
};

// ---------- legs
const Leg: React.FC<{ side: -1 | 1; swing: number }> = ({ side, swing }) => (
  <g transform={`translate(${side * 24} -125) rotate(${swing})`}>
    <rect
      x={-18}
      y={0}
      width={36}
      height={108}
      rx={16}
      fill={COLORS.pajama}
      stroke={COLORS.outline}
      strokeWidth={4}
    />
    <rect
      x={-19}
      y={90}
      width={38}
      height={14}
      rx={6}
      fill={COLORS.pajamaLight}
      stroke={COLORS.outline}
      strokeWidth={3.5}
    />
    <ellipse
      cx={side * 8}
      cy={114}
      rx={24}
      ry={12}
      fill={COLORS.skin}
      stroke={COLORS.outline}
      strokeWidth={4}
    />
  </g>
);

// ---------- face parts
const Eye: React.FC<{ x: number; open: number; look: Pt }> = ({
  x,
  open,
  look,
}) => {
  const y = -332;
  if (open < 0.2) {
    return (
      <path
        d={`M ${x - 11} ${y} Q ${x} ${y + 8} ${x + 11} ${y}`}
        stroke={COLORS.outline}
        strokeWidth={4.5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  const cx = x + look.x * 3.5;
  const cy = y + look.y * 3;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={10} ry={13 * open} fill={COLORS.eye} />
      <circle cx={cx + 3.5} cy={cy - 4.5 * open} r={3.6} fill="white" />
      <circle cx={cx - 3} cy={cy + 4 * open} r={1.6} fill="white" />
    </g>
  );
};

const Mouth: React.FC<{ open: number; smile: number }> = ({ open, smile }) => {
  const y = -297;
  if (open > 0.04) {
    const w = 13 + 4 * open;
    const h = 8 + 20 * open;
    return (
      <g>
        <path
          d={`M ${-w} ${y} Q 0 ${y - 4} ${w} ${y} Q ${w * 0.9} ${y + h} 0 ${y + h} Q ${-w * 0.9} ${y + h} ${-w} ${y} Z`}
          fill={COLORS.mouth}
          stroke={COLORS.outline}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        <ellipse
          cx={0}
          cy={y + h * 0.72}
          rx={w * 0.5}
          ry={h * 0.22}
          fill={COLORS.tongue}
        />
      </g>
    );
  }
  if (smile > 0.6) {
    // big happy grin
    const w = 18;
    return (
      <path
        d={`M ${-w} ${y - 3} Q 0 ${y - 1} ${w} ${y - 3} Q ${w * 0.8} ${y + 17} 0 ${y + 17} Q ${-w * 0.8} ${y + 17} ${-w} ${y - 3} Z`}
        fill={COLORS.mouth}
        stroke={COLORS.outline}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
    );
  }
  return (
    <path
      d={`M -15 ${y - 2} Q 0 ${y + 6 + smile * 8} 15 ${y - 2}`}
      stroke={COLORS.outline}
      strokeWidth={4.5}
      fill="none"
      strokeLinecap="round"
    />
  );
};

const Star: React.FC<{ x: number; y: number; r: number; fill: string }> = ({
  x,
  y,
  r,
  fill,
}) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${x + rad * Math.cos(a)},${y + rad * Math.sin(a)}`;
  }).join(" ");
  return (
    <polygon
      points={pts}
      fill={fill}
      stroke={COLORS.outline}
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
  );
};

// ---------- the whole kid
export const Kid: React.FC<KidProps> = ({
  rightHand = REST_RIGHT,
  leftHand = REST_LEFT,
  eyesOpen = 1,
  look = { x: 0, y: 0 },
  mouthOpen = 0,
  smile = 0.4,
  headTilt = 0,
  kippah = "head",
  showLegs = true,
  legSwing = 0,
}) => {
  const heldKippah = kippah && kippah !== "head" ? kippah : null;
  return (
    <g>
      {/* legs */}
      {showLegs ? (
        <>
          <Leg side={-1} swing={legSwing} />
          <Leg side={1} swing={-legSwing} />
        </>
      ) : null}

      {/* neck */}
      <rect x={-15} y={-272} width={30} height={26} fill={COLORS.skinShade} />

      {/* pajama top */}
      <path
        d="M -52 -254 Q 0 -266 52 -254 Q 70 -190 72 -122 Q 0 -104 -72 -122 Q -70 -190 -52 -254 Z"
        fill={COLORS.pajama}
        stroke={COLORS.outline}
        strokeWidth={4.5}
        strokeLinejoin="round"
      />
      <path
        d="M -69 -134 Q 0 -116 69 -134"
        stroke={COLORS.pajamaDark}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M -26 -258 L 0 -236 L 26 -258"
        stroke={COLORS.pajamaLight}
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[-212, -184, -156].map((y) => (
        <circle
          key={y}
          cx={0}
          cy={y}
          r={5}
          fill="white"
          stroke={COLORS.outline}
          strokeWidth={2.5}
        />
      ))}
      <Star x={-34} y={-200} r={13} fill="#FFD84D" />

      {/* head (tilts around the neck) */}
      <g transform={`rotate(${headTilt} 0 -262)`}>
        <circle
          cx={-76}
          cy={-328}
          r={15}
          fill={COLORS.skin}
          stroke={COLORS.outline}
          strokeWidth={4}
        />
        <circle
          cx={76}
          cy={-328}
          r={15}
          fill={COLORS.skin}
          stroke={COLORS.outline}
          strokeWidth={4}
        />
        <ellipse
          cx={0}
          cy={-332}
          rx={78}
          ry={74}
          fill={COLORS.skin}
          stroke={COLORS.outline}
          strokeWidth={4.5}
        />
        {/* hair */}
        <path
          d="M -4 -412 C -12 -438 12 -448 16 -430 C 9 -436 3 -428 7 -414"
          fill={COLORS.hair}
          stroke={COLORS.hairDark}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path
          d="M -81 -326 C -90 -392 -42 -418 0 -416 C 44 -418 92 -394 81 -326 C 74 -352 62 -366 46 -368 C 32 -352 8 -350 -4 -366 C -20 -350 -46 -350 -56 -364 C -68 -356 -78 -344 -81 -326 Z"
          fill={COLORS.hair}
          stroke={COLORS.hairDark}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path
          d="M -40 -398 Q -20 -408 0 -404"
          stroke={COLORS.hairDark}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        {/* face */}
        <path
          d="M -40 -358 Q -28 -366 -16 -358"
          stroke={COLORS.hairDark}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 16 -358 Q 28 -366 40 -358"
          stroke={COLORS.hairDark}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        <Eye x={-28} open={eyesOpen} look={look} />
        <Eye x={28} open={eyesOpen} look={look} />
        <circle cx={-50} cy={-306} r={12} fill={COLORS.cheek} opacity={0.45} />
        <circle cx={50} cy={-306} r={12} fill={COLORS.cheek} opacity={0.45} />
        <path
          d="M -5 -316 Q 0 -310 5 -316"
          stroke={COLORS.skinShade}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        <Mouth open={mouthOpen} smile={smile} />
        {kippah === "head" ? <Kippah {...KIPPAH_ON_HEAD} /> : null}
      </g>

      {heldKippah ? <Kippah {...heldKippah} /> : null}

      {/* arms in front of the body */}
      <Arm side={-1} target={rightHand} />
      <Arm side={1} target={leftHand} />
    </g>
  );
};
