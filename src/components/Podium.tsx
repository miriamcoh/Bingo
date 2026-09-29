"use client";

import { useEffect } from "react";
import { Avatar } from "./Avatar";
import { celebrate } from "@/lib/confetti";
import type { Player } from "@/lib/types";

const STEP_STYLE: Record<number, { height: string; bg: string; medal: string }> = {
  1: { height: "h-36 sm:h-44", bg: "linear-gradient(180deg, #ffe08a, #f2c14e)", medal: "🥇" },
  2: { height: "h-24 sm:h-32", bg: "linear-gradient(180deg, var(--t-step2-a), var(--t-step2-b))", medal: "🥈" },
  3: { height: "h-16 sm:h-24", bg: "linear-gradient(180deg, var(--t-step3-a), var(--t-step3-b))", medal: "🥉" },
};

function Step({ place, players }: { place: number; players: Player[] }) {
  const style = STEP_STYLE[place] ?? STEP_STYLE[3];
  const many = players.length;
  const avatarSize = many >= 4 ? 40 : many >= 2 ? 48 : 64;
  return (
    <div
      className="flex min-w-0 flex-col items-center justify-end"
      style={{ flex: `${Math.max(1, Math.min(many, 3))} 1 0%` }}
    >
      {players.length > 0 && (
        <div
          className="mb-2 flex flex-wrap items-end justify-center gap-x-1 gap-y-2 animate-rise"
          style={{ animationDelay: `${0.4 + (3 - place) * 0.3}s` }}
        >
          {players.map((p) => (
            <div key={p.id} className="flex w-16 flex-col items-center sm:w-20">
              {place === 1 && <span className="text-xl leading-none">👑</span>}
              <Avatar id={p.avatar} size={avatarSize} ring={place === 1} />
              <span className="mt-1 w-full truncate text-center text-xs font-bold sm:text-sm">{p.name}</span>
            </div>
          ))}
        </div>
      )}
      {players.length > 0 ? (
        <div
          className={`flex w-full items-start justify-center rounded-t-2xl pt-2 font-display text-3xl font-bold text-white shadow-lg ${style.height}`}
          style={{ background: style.bg, textShadow: "0 2px 4px color-mix(in srgb, var(--t-plum) 45%, transparent)" }}
        >
          <span>
            {style.medal} {place}
          </span>
        </div>
      ) : (
        <div className="h-4 w-full" />
      )}
    </div>
  );
}

/**
 * פודיום: מקום 1 באמצע ולמעלה, 2 משמאל, 3 מימין.
 * בתיקו כמה שחקנים עומדים יחד על אותה מדרגה.
 */
export function Podium({ players, name }: { players: Player[]; name: string }) {
  useEffect(() => celebrate(7000), []);

  const winners = players
    .filter((p) => p.place != null)
    .sort((a, b) => (a.finished_at ?? "").localeCompare(b.finished_at ?? ""));
  const at = (place: number) => winners.filter((p) => p.place === place);

  return (
    <section className="card-surface overflow-hidden px-3 pt-6">
      <h2 className="text-center font-display text-4xl font-bold text-hot drop-shadow-sm sm:text-5xl">
        מזל טוב {name}! 🎂
      </h2>
      <p className="mt-1 text-center text-plum/70">המנצחים של הבינגו</p>
      {winners.length === 0 ? (
        <p className="py-10 text-center text-lg">המשחק נגמר בלי מנצחים הפעם 💕</p>
      ) : (
        // dir=ltr כדי ש"שמאל" ו"ימין" יהיו בדיוק כמו שביקשנו
        <div dir="ltr" className="mt-6 flex items-end gap-2">
          <Step place={2} players={at(2)} />
          <Step place={1} players={at(1)} />
          <Step place={3} players={at(3)} />
        </div>
      )}
    </section>
  );
}
