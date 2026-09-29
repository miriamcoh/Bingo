"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CenterMessage, Loading, Shell } from "@/components/Shell";
import { DrawnBall } from "@/components/DrawnBall";
import { NumberBoard, NumberHistory } from "@/components/NumberHistory";
import { PlayersList } from "@/components/PlayersList";
import { Podium } from "@/components/Podium";
import { TieCountdown } from "@/components/TieCountdown";
import { InviteCard } from "@/components/InviteCard";
import { CelebrationForm, type Celebration } from "@/components/CelebrationForm";
import { useToast } from "@/components/Toast";
import { useWinnerAnnouncements } from "@/components/useWinnerAnnouncements";
import { rpc } from "@/lib/supabase";
import { getHostToken } from "@/lib/storage";
import { errorMessage } from "@/lib/errors";
import { useRoom } from "@/lib/useRoom";
import { useApplyTheme } from "@/lib/theme";
import { celebrantName, celebrationTitle } from "@/lib/types";

type HostAction = "start_game" | "draw_number" | "end_game" | "new_game";

export default function HostPage() {
  const params = useParams<{ code: string }>();
  const code = String(params.code ?? "").toUpperCase();
  const toast = useToast();
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const { room, players, state, refresh } = useRoom(code);
  const [editing, setEditing] = useState(false);
  useApplyTheme(room ? (room.theme ?? "pink") : undefined);
  const title = celebrationTitle(room);

  useEffect(() => setToken(getHostToken(code)), [code]);
  useWinnerAnnouncements(players, room?.game_no);

  const act = useCallback(
    async (fn: HostAction) => {
      if (!token) return;
      setBusy(true);
      const { error } = await rpc(fn, { p_code: code, p_host_token: token });
      if (error) toast(errorMessage(error), "warn");
      await refresh();
      setBusy(false);
    },
    [code, token, toast, refresh],
  );

  const onTieDone = useCallback(() => void refresh(), [refresh]);

  const saveCelebration = useCallback(
    async (c: Celebration) => {
      if (!token) return;
      setBusy(true);
      const { error } = await rpc("update_celebration", {
        p_code: code,
        p_host_token: token,
        p_name: c.name,
        p_age: c.age,
        p_theme: c.theme,
      });
      if (error) toast(errorMessage(error), "warn");
      else setEditing(false);
      await refresh();
      setBusy(false);
    },
    [code, token, toast, refresh],
  );

  if (state === "loading" || token === undefined) return <Shell><Loading /></Shell>;
  if (state === "notfound" || state === "error" || !room) {
    return (
      <Shell>
        <CenterMessage emoji="🤔" title={state === "error" ? "בעיית חיבור, נסו לרענן" : "החדר לא נמצא"}>
          <Link href="/" className="btn btn-primary">לדף הבית</Link>
        </CenterMessage>
      </Shell>
    );
  }
  if (!token) {
    return (
      <Shell>
        <CenterMessage emoji="👑" title="רק מי שיצר את החדר יכול לנהל אותו">
          <p className="mb-4">רוצים לשחק? הצטרפו כשחקנים:</p>
          <Link href={`/play/${code}`} className="btn btn-primary">הצטרפות למשחק</Link>
        </CenterMessage>
      </Shell>
    );
  }

  const last = room.drawn.length ? room.drawn[room.drawn.length - 1] : null;

  // ---------- חדר המתנה ----------
  if (room.status === "lobby") {
    return (
      <Shell wide title={title}>
        <section className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-display text-3xl font-bold text-hot sm:text-4xl">🎂 {title}!</h1>
          {!editing && (
            <button className="text-sm text-plum/60 underline" onClick={() => setEditing(true)}>
              שינוי שם, גיל או עיצוב
            </button>
          )}
        </section>
        {editing && (
          <div className="mx-auto w-full max-w-lg">
            <CelebrationForm
              initial={{ name: celebrantName(room), age: room.celebrant_age ?? null, theme: room.theme ?? "pink" }}
              submitLabel="שמירה"
              busy={busy}
              onSubmit={saveCelebration}
              onCancel={() => setEditing(false)}
            />
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <InviteCard code={code} title={title} />
          <div className="flex flex-col gap-4">
            <PlayersList players={players} title="מי כבר כאן?" showProgress={false} />
            <button className="btn btn-primary py-5 text-2xl" onClick={() => act("start_game")} disabled={busy}>
              🎉 התחל משחק
            </button>
            <p className="text-center text-sm text-plum/60">אפשר להצטרף גם אחרי שהמשחק התחיל</p>
          </div>
        </div>
      </Shell>
    );
  }

  // ---------- סוף המשחק ----------
  if (room.status === "finished") {
    return (
      <Shell wide title={title}>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          <Podium players={players} name={celebrantName(room)} />
          <button
            className="btn btn-primary py-4 text-xl"
            disabled={busy}
            onClick={() => {
              if (confirm("להתחיל משחק חדש? כל השחקנים יקבלו כרטיס חדש.")) void act("new_game");
            }}
          >
            🔄 משחק חדש
          </button>
          <PlayersList players={players} title="כל השחקנים" />
        </div>
      </Shell>
    );
  }

  // ---------- במהלך המשחק ----------
  const inTie = room.status === "tiebreak";
  const allDrawn = room.drawn.length >= 100;

  return (
    <Shell wide title={title}>
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          {inTie && room.tie_deadline && <TieCountdown code={code} deadline={room.tie_deadline} onDone={onTieDone} />}
          <section className="card-surface flex flex-col items-center gap-6 p-6">
            <p className="font-display text-lg text-plum/70">
              {last == null ? "מוכנים? לוחצים להגרלה!" : `המספר ה-${room.drawn.length}`}
            </p>
            <DrawnBall number={last} size="xl" />
            <button
              className="btn btn-primary w-full max-w-sm py-6 text-3xl"
              onClick={() => act("draw_number")}
              disabled={busy || inTie || allDrawn}
            >
              {inTie ? "⏳ רגע..." : allDrawn ? "כל המספרים יצאו" : "🎲 הגרל מספר"}
            </button>
          </section>
          <section className="card-surface p-4">
            <NumberBoard drawn={room.drawn} />
          </section>
          <div className="lg:hidden">
            <NumberHistory drawn={room.drawn} />
          </div>
        </div>
        <aside className="flex flex-col gap-4">
          <PlayersList players={players} />
          <InviteCard code={code} title={title} compact />
          <button
            className="text-sm text-plum/60 underline"
            onClick={() => {
              if (confirm("לסיים את המשחק עכשיו ולהציג את המנצחים?")) void act("end_game");
            }}
          >
            סיום המשחק עכשיו
          </button>
        </aside>
      </div>
    </Shell>
  );
}
