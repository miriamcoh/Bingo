import React from "react";
import { Pt } from "../anim";
import { COLORS } from "./Kid";

const O = COLORS.outline;

// In the bathroom the kid stands behind the sink. "Stage" coordinates are
// the kid's own coordinates when he stands at the sink, so it is easy to
// put hands, natla, faucet and towel in the same place.
export const STAGE = { x: 960, y: 1000, scale: 1.25 };
export const STAGE_TRANSFORM = `translate(${STAGE.x} ${STAGE.y}) scale(${STAGE.scale})`;

export const COUNTER_TOP = -110; // the counter surface
export const BOWL_RIM = -132; // the top of the sink bowl
export const NATLA_ON_COUNTER: Pt = { x: 140, y: -142 };
export const FAUCET_SPOUT: Pt = { x: -80, y: -228 };
export const TOWEL_HOOK: Pt = { x: 215, y: -252 };

// Wall, tiles, floor, shelf and a little round window (screen coordinates).
export const BathroomBackground: React.FC = () => (
  <g>
    <defs>
      <pattern
        id="bath-tiles"
        width={80}
        height={80}
        patternUnits="userSpaceOnUse"
      >
        <rect width={80} height={80} fill="#BDE6E8" />
        <rect
          width={80}
          height={80}
          fill="none"
          stroke="#A3D6DA"
          strokeWidth={5}
        />
      </pattern>
      <pattern
        id="bath-floor"
        width={120}
        height={120}
        patternUnits="userSpaceOnUse"
      >
        <rect width={120} height={120} fill="#F7D9A8" />
        <rect width={60} height={60} fill="#EFC78A" />
        <rect x={60} y={60} width={60} height={60} fill="#EFC78A" />
      </pattern>
    </defs>
    <rect x={0} y={0} width={1920} height={330} fill="#FFF3DC" />
    <rect x={0} y={330} width={1920} height={600} fill="url(#bath-tiles)" />
    <rect
      x={0}
      y={318}
      width={1920}
      height={18}
      fill="#FFFFFF"
      stroke={O}
      strokeWidth={3}
    />
    <rect x={0} y={930} width={1920} height={300} fill="url(#bath-floor)" />
    <line x1={0} x2={1920} y1={930} y2={930} stroke={O} strokeWidth={4} />

    {/* round window */}
    <circle
      cx={330}
      cy={200}
      r={95}
      fill="#FFFFFF"
      stroke={O}
      strokeWidth={5}
    />
    <circle cx={330} cy={200} r={78} fill="#9AD9FF" />
    <ellipse cx={300} cy={185} rx={34} ry={14} fill="white" />
    <ellipse cx={360} cy={225} rx={28} ry={11} fill="white" />
    <circle cx={370} cy={160} r={20} fill="#FFD23F" />
    <line x1={330} x2={330} y1={122} y2={278} stroke="white" strokeWidth={8} />

    {/* shelf with a cup and a rubber duck */}
    <rect
      x={200}
      y={500}
      width={300}
      height={18}
      rx={6}
      fill="#F6B26B"
      stroke={O}
      strokeWidth={4}
    />
    <path
      d="M 240 500 L 245 440 L 290 440 L 295 500 Z"
      fill="#FF8FA3"
      stroke={O}
      strokeWidth={4}
    />
    <line
      x1={258}
      y1={442}
      x2={250}
      y2={400}
      stroke="#5BC0F8"
      strokeWidth={8}
      strokeLinecap="round"
    />
    <line
      x1={276}
      y1={442}
      x2={290}
      y2={404}
      stroke="#7ED957"
      strokeWidth={8}
      strokeLinecap="round"
    />
    <g transform="translate(410 470)">
      <ellipse
        cx={0}
        cy={10}
        rx={42}
        ry={22}
        fill="#FFD23F"
        stroke={O}
        strokeWidth={4}
      />
      <circle
        cx={22}
        cy={-16}
        r={20}
        fill="#FFD23F"
        stroke={O}
        strokeWidth={4}
      />
      <path
        d="M 38 -16 L 56 -10 L 38 -6 Z"
        fill="#FF8A3D"
        stroke={O}
        strokeWidth={3}
      />
      <circle cx={28} cy={-21} r={3.5} fill={O} />
    </g>

    {/* bath mat */}
    <ellipse
      cx={960}
      cy={1040}
      rx={260}
      ry={34}
      fill="#9EE0B5"
      stroke={O}
      strokeWidth={4}
    />
  </g>
);

// Cabinet, counter and sink bowl. Drawn IN FRONT of the kid (stage coordinates).
export const SinkFront: React.FC = () => (
  <g>
    <rect
      x={-215}
      y={COUNTER_TOP}
      width={430}
      height={130}
      rx={10}
      fill="#F6B26B"
      stroke={O}
      strokeWidth={4}
    />
    <rect
      x={-195}
      y={COUNTER_TOP + 22}
      width={185}
      height={90}
      rx={8}
      fill="#FFC98A"
      stroke={O}
      strokeWidth={3.5}
    />
    <rect
      x={10}
      y={COUNTER_TOP + 22}
      width={185}
      height={90}
      rx={8}
      fill="#FFC98A"
      stroke={O}
      strokeWidth={3.5}
    />
    <circle
      cx={-24}
      cy={COUNTER_TOP + 66}
      r={6}
      fill="#B5683A"
      stroke={O}
      strokeWidth={2.5}
    />
    <circle
      cx={24}
      cy={COUNTER_TOP + 66}
      r={6}
      fill="#B5683A"
      stroke={O}
      strokeWidth={2.5}
    />
    <rect
      x={-230}
      y={COUNTER_TOP - 8}
      width={460}
      height={18}
      rx={8}
      fill="#FFF7EE"
      stroke={O}
      strokeWidth={4}
    />
    {/* sink bowl */}
    <path
      d={`M -112 ${BOWL_RIM} C -104 ${COUNTER_TOP - 4} -60 ${COUNTER_TOP - 8} 0 ${COUNTER_TOP - 8} C 60 ${COUNTER_TOP - 8} 104 ${COUNTER_TOP - 4} 112 ${BOWL_RIM} Z`}
      fill="#FFFFFF"
      stroke={O}
      strokeWidth={4}
    />
    <ellipse
      cx={0}
      cy={BOWL_RIM}
      rx={112}
      ry={11}
      fill="#DDF2FB"
      stroke={O}
      strokeWidth={4}
    />
  </g>
);

const FAUCET_PATH = `M -150 ${COUNTER_TOP} L -150 -232 Q -150 -250 -130 -250 L -100 -250 Q -80 -250 -80 -232 L -80 ${FAUCET_SPOUT.y}`;

// Faucet standing on the counter. `lever` (0..1) turns it on.
export const Faucet: React.FC<{ lever: number }> = ({ lever }) => (
  <g>
    <path
      d={FAUCET_PATH}
      stroke={O}
      strokeWidth={22}
      fill="none"
      strokeLinejoin="round"
    />
    <path
      d={FAUCET_PATH}
      stroke="#D7E3EA"
      strokeWidth={14}
      fill="none"
      strokeLinejoin="round"
    />
    <rect
      x={-92}
      y={FAUCET_SPOUT.y - 6}
      width={24}
      height={10}
      rx={3}
      fill="#AFC3CF"
      stroke={O}
      strokeWidth={3}
    />
    <rect
      x={-172}
      y={COUNTER_TOP - 22}
      width={44}
      height={22}
      rx={6}
      fill="#D7E3EA"
      stroke={O}
      strokeWidth={3.5}
    />
    <g transform={`rotate(${-35 * lever} -150 -180)`}>
      <rect
        x={-196}
        y={-187}
        width={46}
        height={14}
        rx={7}
        fill="#5BC0F8"
        stroke={O}
        strokeWidth={3.5}
      />
    </g>
  </g>
);

// Towel. `anchor` is its top middle. On the hook it hangs straight;
// `squash` < 1 bunches it up when it is in the kid's hands.
export const Towel: React.FC<{
  anchor: Pt;
  squash?: number;
  rotate?: number;
}> = ({ anchor, squash = 1, rotate = 0 }) => (
  <g
    transform={`translate(${anchor.x} ${anchor.y}) rotate(${rotate}) scale(${1 + (1 - squash) * 0.4} ${squash})`}
  >
    <path
      d="M -34 0 L 34 0 L 36 112 Q 0 120 -36 112 Z"
      fill="#FFB0C8"
      stroke={O}
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path d="M -35 84 L 35 84" stroke="#FFFFFF" strokeWidth={8} />
    <path d="M -35 98 L 35 98" stroke="#FF7FA6" strokeWidth={6} />
    <path
      d="M -34 0 L 34 0"
      stroke="#FF7FA6"
      strokeWidth={8}
      strokeLinecap="round"
    />
  </g>
);

export const TowelHook: React.FC = () => (
  <g>
    <circle
      cx={TOWEL_HOOK.x}
      cy={TOWEL_HOOK.y - 4}
      r={10}
      fill="#D7E3EA"
      stroke={O}
      strokeWidth={3.5}
    />
  </g>
);

// The normal (wide) bathroom shot: a little closer than the full room.
export const WIDE_SHOT = { zoom: 1.3, focus: { x: 960, y: 700 } };

// Moves the "camera": zoom > 1 zooms in on `focus` (screen coordinates).
export const Camera: React.FC<{
  zoom: number;
  focus: Pt;
  children: React.ReactNode;
}> = ({ zoom, focus, children }) => (
  <g
    transform={`translate(960 540) scale(${zoom}) translate(${-focus.x} ${-focus.y})`}
  >
    {children}
  </g>
);
