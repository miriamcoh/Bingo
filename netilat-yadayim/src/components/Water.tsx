import React from "react";
import { random } from "remotion";
import { Pt } from "../anim";

const WATER = "#5BB8F5";

// A stream of water from one point to another. `frame` makes the
// white highlights slide along it, so it looks like it is flowing.
export const Stream: React.FC<{
  from: Pt;
  to: Pt;
  width?: number;
  frame: number;
}> = ({ from, to, width = 9, frame }) => {
  const c = { x: to.x + (from.x - to.x) * 0.2, y: from.y + 2 };
  const d = `M ${from.x} ${from.y} Q ${c.x} ${c.y} ${to.x} ${to.y}`;
  return (
    <g>
      <path
        d={d}
        stroke={WATER}
        strokeWidth={width}
        strokeLinecap="round"
        fill="none"
        opacity={0.9}
      />
      <path
        d={d}
        stroke="#E8F7FF"
        strokeWidth={width * 0.32}
        strokeDasharray="7 13"
        strokeDashoffset={-frame * 5}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
};

const Drop: React.FC<{ x: number; y: number; s: number; opacity: number }> = ({
  x,
  y,
  s,
  opacity,
}) => (
  <path
    d={`M ${x} ${y - 1.9 * s} C ${x + s} ${y - 0.5 * s} ${x + s} ${y + s} ${x} ${y + s} C ${x - s} ${y + s} ${x - s} ${y - 0.5 * s} ${x} ${y - 1.9 * s} Z`}
    fill={WATER}
    stroke="#2F8BD0"
    strokeWidth={0.8}
    opacity={opacity}
  />
);

// Falling drops. Uses remotion's random() with a seed so every render
// looks exactly the same (never Math.random).
export const Drops: React.FC<{
  origin: Pt;
  fall: number;
  spread: number;
  frame: number;
  seed: string;
  count?: number;
  amount?: number; // 0..1 fades the drops in and out
  period?: number;
  size?: number;
}> = ({
  origin,
  fall,
  spread,
  frame,
  seed,
  count = 8,
  amount = 1,
  period = 16,
  size = 4,
}) => {
  if (amount <= 0) {
    return null;
  }
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const offset = random(`${seed}-o-${i}`) * period;
        const t = ((frame + offset) % period) / period;
        const dx = (random(`${seed}-x-${i}`) - 0.5) * spread * (0.4 + t);
        const s = size * (0.6 + random(`${seed}-s-${i}`) * 0.6);
        return (
          <Drop
            key={i}
            x={origin.x + dx}
            y={origin.y + t * t * fall}
            s={s}
            opacity={amount * Math.min(1, (1 - t) * 3)}
          />
        );
      })}
    </g>
  );
};
