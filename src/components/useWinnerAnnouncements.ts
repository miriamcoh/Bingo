"use client";

import { useEffect, useRef } from "react";
import { useToast } from "./Toast";
import { burst } from "@/lib/confetti";
import type { Player } from "@/lib/types";

/** מציג הודעה חגיגית לכולם בכל פעם שמישהו חדש נכנס לרשימת המנצחים */
export function useWinnerAnnouncements(players: Player[], gameNo: number | undefined, meId?: string) {
  const toast = useToast();
  const known = useRef<Set<string> | null>(null);
  const game = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (gameNo === undefined) return;
    const winners = players.filter((p) => p.place != null);
    // בטעינה הראשונה (או משחק חדש) לא מכריזים על מי שכבר ניצח
    if (known.current === null || game.current !== gameNo) {
      known.current = new Set(winners.map((p) => p.id));
      game.current = gameNo;
      return;
    }
    const fresh = winners.filter((p) => !known.current!.has(p.id));
    if (fresh.length === 0) return;
    fresh.forEach((p) => known.current!.add(p.id));
    burst();
    for (const p of fresh) {
      const text =
        p.id === meId ? `🎉 בינגו! סיימת את הכרטיס – מקום ${p.place}!` : `🎉 בינגו! ${p.name} במקום ${p.place}!`;
      toast(text, "party", 4500);
    }
  }, [players, gameNo, meId, toast]);
}
