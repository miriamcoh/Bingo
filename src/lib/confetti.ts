"use client";

import confetti from "canvas-confetti";

const COLORS = ["#ff2e93", "#ff7ab8", "#ffb3d4", "#f2c14e", "#ffe08a", "#ffffff"];

export function burst() {
  void confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 }, colors: COLORS, disableForReducedMotion: true });
}

/** קונפטי מתמשך לפודיום. מחזיר פונקציה שעוצרת אותו. */
export function celebrate(durationMs = 6000): () => void {
  const end = Date.now() + durationMs;
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
