"use client";

import { useEffect, useRef, useState } from "react";

/**
 * הכדור עם המספר האחרון שהוגרל.
 * כשמגיע מספר חדש – מגלגלים מספרים אקראיים לרגע ואז "קופץ" המספר האמיתי.
 */
export function DrawnBall({ number, size = "md" }: { number: number | null; size?: "md" | "xl" }) {
  const [shown, setShown] = useState<number | null>(number);
  const [rolling, setRolling] = useState(false);
  const prev = useRef(number);

  useEffect(() => {
    if (number === prev.current || number == null) {
      prev.current = number;
      setShown(number);
      setRolling(false);
      return;
    }
    prev.current = number;
    setRolling(true);
    const spin = setInterval(() => setShown(1 + Math.floor(Math.random() * 100)), 70);
    const stop = setTimeout(() => {
      clearInterval(spin);
      setShown(number);
      setRolling(false);
    }, 900);
    return () => {
      clearInterval(spin);
      clearTimeout(stop);
    };
  }, [number]);

  const dims =
    size === "xl"
      ? "h-56 w-56 text-[7rem] sm:h-72 sm:w-72 sm:text-[9rem] lg:h-96 lg:w-96 lg:text-[12rem]"
      : "h-28 w-28 text-6xl";

  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute rounded-full bg-gold/40 blur-2xl ${dims}`} aria-hidden />
      <div
        key={rolling ? "rolling" : `n-${shown}`}
        className={`relative flex items-center justify-center rounded-full font-display font-bold text-white ring-8 ring-white/80 ${dims} ${
          rolling ? "animate-roll" : "animate-pop"
        }`}
        style={{
          background: "radial-gradient(circle at 30% 25%, #ff9ccc 0, #ff2e93 45%, #b8106a 100%)",
          boxShadow: "0 12px 30px rgb(214 25 127 / 0.45), inset 0 -10px 20px rgb(0 0 0 / 0.15)",
        }}
        aria-live="polite"
      >
        {shown ?? "?"}
        {!rolling && shown != null && (
          <>
            <span className="absolute -right-2 -top-2 animate-twinkle text-3xl text-gold">✦</span>
            <span className="absolute -bottom-1 -left-3 animate-twinkle text-2xl text-gold" style={{ animationDelay: "0.8s" }}>
              ✦
            </span>
          </>
        )}
      </div>
    </div>
  );
}
