"use client";

import { useState } from "react";

export function BingoCard({
  card,
  marked,
  missed,
  highlight,
  disabled,
  onTap,
}: {
  card: number[];
  marked: Set<number>;
  missed: Set<number>;
  highlight: boolean;
  disabled: boolean;
  onTap: (n: number) => Promise<boolean>;
}) {
  const [shake, setShake] = useState<number | null>(null);

  async function tap(n: number) {
    const ok = await onTap(n);
    if (!ok) {
      setShake(n);
      setTimeout(() => setShake((s) => (s === n ? null : s)), 450);
    }
  }

  return (
    <div className="grid grid-cols-5 gap-2" dir="ltr">
      {card.map((n) => {
        const isMarked = marked.has(n);
        const glow = highlight && missed.has(n);
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => void tap(n)}
            aria-pressed={isMarked}
            aria-label={`מספר ${n}${isMarked ? " מסומן" : ""}`}
            className={`relative flex aspect-square items-center justify-center rounded-2xl font-display text-2xl font-bold transition active:scale-90 sm:text-3xl ${
              isMarked
                ? "bg-gradient-to-br from-hot to-berry text-white shadow-inner"
                : "bg-white text-plum shadow-md ring-2 ring-petal"
            } ${glow ? "animate-glow z-10" : ""} ${shake === n ? "animate-wiggle" : ""}`}
          >
            <span className="relative z-10">{n}</span>
            {isMarked && (
              <span className="absolute inset-0 flex items-center justify-center text-4xl opacity-30 animate-pop" aria-hidden>
                ♥
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
