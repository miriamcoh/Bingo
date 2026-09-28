"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { TIE_WINDOW_SECONDS } from "@/lib/types";

/** ספירה לאחור של חלון התיקו. בסופה מבקשים מהשרת לסגור את המשחק. */
export function TieCountdown({ code, deadline, onDone }: { code: string; deadline: string; onDone: () => void }) {
  const end = new Date(deadline).getTime();
  const calc = () => Math.max(0, Math.min(TIE_WINDOW_SECONDS, Math.ceil((end - Date.now()) / 1000)));
  const [left, setLeft] = useState(calc);
  const asked = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setLeft(calc()), 250);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end]);

  useEffect(() => {
    if (left > 0 || asked.current) return;
    asked.current = true;
    const finalize = async () => {
      // השרת מסרב אם השעון שלו עוד לא הגיע – ננסה שוב עוד רגע
      for (let i = 0; i < 6; i++) {
        const { data } = await getSupabase().rpc("finalize_room", { p_code: code });
        if (data === "finished") break;
        await new Promise((r) => setTimeout(r, 1000));
      }
      onDone();
    };
    void finalize();
  }, [left, code, onDone]);

  return (
    <div className="card-surface flex items-center gap-4 p-4 ring-4 ring-gold animate-pop">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-hot font-display text-3xl font-bold text-white">
        {left}
      </div>
      <div>
        <p className="font-display text-lg font-bold">בודקים אם יש עוד מנצחים...</p>
        <p className="text-sm text-plum/70">מי שמסיים את הכרטיס עכשיו – מצטרף לאותו מקום!</p>
      </div>
    </div>
  );
}
