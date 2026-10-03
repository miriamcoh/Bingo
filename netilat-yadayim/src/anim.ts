import { Easing, interpolate } from "remotion";

// Small helpers so every scene animates the same way.
// Everything is a pure function of the current frame (no CSS animations).

export type Pt = { x: number; y: number };

export const ease = Easing.inOut(Easing.cubic);

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Animate a single number from a to b between two frames.
export const tween = (
  frame: number,
  [f0, f1]: [number, number],
  [a, b]: [number, number],
  easing: (t: number) => number = ease,
) => interpolate(frame, [f0, f1], [a, b], { ...clamp, easing });

// Animate a number through several keyframes: [[frame, value], ...]
export const keys = (frame: number, k: [number, number][]) =>
  interpolate(
    frame,
    k.map((p) => p[0]),
    k.map((p) => p[1]),
    { ...clamp, easing: ease },
  );

// Animate a point through several keyframes: [[frame, {x, y}], ...]
export const keyPt = (frame: number, k: [number, Pt][]): Pt => ({
  x: keys(
    frame,
    k.map(([f, p]) => [f, p.x]),
  ),
  y: keys(
    frame,
    k.map(([f, p]) => [f, p.y]),
  ),
});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
});
export const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });

export const rotatePt = (p: Pt, deg: number): Pt => {
  const r = (deg * Math.PI) / 180;
  return {
    x: p.x * Math.cos(r) - p.y * Math.sin(r),
    y: p.x * Math.sin(r) + p.y * Math.cos(r),
  };
};

// A natural blink every ~3 seconds. Returns how open the eyes are (0..1).
export const blink = (frame: number, offset = 0) => {
  const c = (frame + offset) % 95;
  return interpolate(c, [86, 89, 92], [1, 0, 1], clamp);
};
