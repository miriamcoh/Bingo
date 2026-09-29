"use client";

import confetti from "canvas-confetti";
import { themeColor } from "./theme";

// צבעי הקונפטי לפי העיצוב של החדר (ורוד וזהב, או תכלת וזהב)
const colors = () => [
  themeColor("hot", "#ff2e93"),
  themeColor("rose", "#ff7ab8"),
  themeColor("petal", "#ffb3d4"),
  themeColor("gold", "#f2c14e"),
  "#ffe08a",
  "#ffffff",
];

export function burst() {
  const COLORS = colors();
  void confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 }, colors: COLORS, disableForReducedMotion: true });
}

/** קונפטי מתמשך לפודיום. מחזיר פונקציה שעוצרת אותו. */
export function celebrate(durationMs = 6000): () => void {
  const end = Date.now() + durationMs;
  const COLORS = colors();
  let stopped = false;
  const frame = () => {
    if (stopped) return;
    void confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS, disableForReducedMotion: true });
    void confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS, disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  burst();
  frame();
  return () => {
    stopped = true;
  };
}
