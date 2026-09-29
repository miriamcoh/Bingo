"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CenterMessage, Loading, Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { BingoCard } from "@/components/BingoCard";
import { DrawnBall } from "@/components/DrawnBall";
import { JoinForm } from "@/components/JoinForm";
import { NumberHistory } from "@/components/NumberHistory";
import { PlayersList } from "@/components/PlayersList";
import { Podium } from "@/components/Podium";
import { TieCountdown } from "@/components/TieCountdown";
import { useToast } from "@/components/Toast";
import { useWinnerAnnouncements } from "@/components/useWinnerAnnouncements";
import { rpc } from "@/lib/supabase";
import { getPlayerSession, setPlayerSession, type PlayerSession } from "@/lib/storage";
import { errorCode, errorMessage } from "@/lib/errors";
import { useRoom } from "@/lib/useRoom";
import { useApplyTheme } from "@/lib/theme";
import { celebrantName, celebrationTitle } from "@/lib/types";
import type { MyCard } from "@/lib/types";

export default function PlayPage() {
  const params = useParams<{ code: string }>();
  const code = String(params.code ?? "").toUpperCase();
  const toast = useToast();
  const { room, players, state, refresh } = useRoom(code);
  useApplyTheme(room ? (room.theme ?? "pink") : undefined);
  const title = celebrationTitle(room);

  const [session, setSession] = useState<PlayerSession | null | undefined>(undefined);
  const [myCard, setMyCard] = useState<MyCard | null>(null);
  const [highlight, setHighlight] = useState(false);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setSession(getPlayerSession(code)), [code]);

  const me = players.find((p) => p.id === session?.playerId);
  useWinnerAnnouncements(players, room?.game_no, session?.playerId);

  // טוענים את הכרטיס (שלי בלבד) – גם אחרי רענון, וגם כשמתחיל משחק חדש
  const gameNo = room?.game_no;
  useEffect(() => {
    if (!session || gameNo === undefined) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await rpc("get_my_card", {
        p_player_id: session.playerId,
        p_token: session.token,
      });
      if (cancelled) return;
      if (error) {
        if (errorCode(error) === "BAD_TOKEN") {
          setPlayerSession(code, null);
          setSession(null);
        }
        return;
      }
      setMyCard(data as MyCard);
    })();
    return () => {
      cancelled = true;
    };
  }, [session, gameNo, code]);

  const drawnSet = useMemo(() => new Set(room?.drawn ?? []), [room?.drawn]);
  const markedSet = useMemo(() => new Set(myCard?.marked ?? []), [myCard?.marked]);
  const missed = useMemo(
    () => new Set((myCard?.card ?? []).filter((n) => drawnSet.has(n) && !markedSet.has(n))),
    [myCard?.card, drawnSet, markedSet],
  );

  // כשאין יותר מה לסמן – מכבים את ההדגשה
  useEffect(() => {
    if (highlight && missed.size === 0) setHighlight(false);
  }, [highlight, missed.size]);

  const mark = useCallback(
    async (n: number): Promise<boolean> => {
      if (!session || !room || !myCard) return false;
      if (markedSet.has(n)) return true;
      if (room.status !== "playing" && room.status !== "tiebreak") {
        toast(room.status === "lobby" ? "המשחק עוד לא התחיל 🙂" : "המשחק נגמר", "warn");
        return false;
      }
      // אם כבר ידוע לנו שהמספר הוגרל – מסמנים מיד (השרת עדיין בודק ויכול לבטל)
      const optimistic = drawnSet.has(n);
      if (optimistic) setMyCard((c) => (c ? { ...c, marked: [...c.marked, n] } : c));

      const { data, error } = await rpc("mark_number", {
        p_player_id: session.playerId,
        p_token: session.token,
        p_number: n,
      });
      if (error) {
        if (optimistic) setMyCard((c) => (c ? { ...c, marked: c.marked.filter((m) => m !== n) } : c));
        toast(errorMessage(error), "warn");
        return false;
      }
      const res = data as { marked: number[] };
      setMyCard((c) => (c ? { ...c, marked: res.marked } : c));
      void refresh();
      return true;
    },
    [session, room, myCard, markedSet, drawnSet, toast, refresh],
  );

  function checkMissed() {
    if (missed.size === 0) {
      toast("לא פספסת אף מספר! 👏");
      return;
    }
    toast(missed.size === 1 ? "יש מספר אחד לסמן ✨" : `יש ${missed.size} מספרים לסמן ✨`);
    setHighlight(true);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlight(false), 10000);
  }

  const onTieDone = useCallback(() => void refresh(), [refresh]);

  // ---------- מצבי טעינה ושגיאה ----------
  if (state === "loading" || session === undefined) return <Shell><Loading /></Shell>;
  if (state === "notfound" || state === "error" || !room) {
    return (
      <Shell>
        <CenterMessage emoji="🤔" title={state === "error" ? "בעיית חיבור, נסו לרענן" : "החדר לא נמצא"}>
          <p className="mb-4">כדאי לבדוק שהקישור נכון</p>
          <Link href="/" className="btn btn-primary">לדף הבית</Link>
        </CenterMessage>
      </Shell>
    );
  }
  if (!session) {
    return (
      <Shell title={title}>
        <JoinForm code={code} title={title} onJoined={(s) => { setSession(s); void refresh(); }} />
      </Shell>
    );
  }
  if (!myCard) return <Shell><Loading /></Shell>;

  const last = room.drawn.length ? room.drawn[room.drawn.length - 1] : null;
  const active = room.status === "playing" || room.status === "tiebreak";
  const remaining = myCard.card.length - myCard.card.filter((n) => markedSet.has(n)).length;

  return (
    <Shell title={title}>
      {/* מי אני */}
      <div className="flex items-center gap-3 rounded-full bg-white/80 py-1.5 pe-4 ps-1.5 shadow-md">
        <Avatar id={me?.avatar ?? "bunny"} size={44} ring={me?.place != null} />
        <span className="flex-1 truncate font-bold">{me?.name ?? ""}</span>
        {me?.place != null ? (
          <span className="rounded-full bg-gold/40 px-3 py-1 text-sm font-bold">🏆 מקום {me.place}</span>
        ) : (
          <span className="text-sm">
            נשארו לי <b className="text-berry">{remaining}</b>
          </span>
        )}
      </div>

      {room.status === "finished" && <Podium players={players} name={celebrantName(room)} />}

      {room.status === "lobby" && (
        <CenterMessage emoji="🎈" title="מחכים שהמנהל/ת יתחילו את המשחק...">
          <p className="text-plum/70">בינתיים, הנה הכרטיס שלך 👇</p>
        </CenterMessage>
      )}

      {room.status === "tiebreak" && room.tie_deadline && (
        <TieCountdown code={code} deadline={room.tie_deadline} onDone={onTieDone} />
      )}

      {active && (
        <section className="card-surface flex items-center justify-around gap-4 p-4">
          <div className="text-center">
            <p className="text-sm text-plum/70">המספר האחרון</p>
            <p className="text-xs text-plum/50">{room.drawn.length} / 100</p>
          </div>
          <DrawnBall number={last} />
        </section>
      )}

      {room.status !== "finished" && (
        <section className="card-surface flex flex-col gap-4 p-4">
          <h2 className="text-center font-display text-lg font-bold">הכרטיס שלי</h2>
          <BingoCard
            card={myCard.card}
            marked={markedSet}
            missed={missed}
            highlight={highlight}
            disabled={false}
            onTap={mark}
          />
          {me?.place != null && (
            <p className="text-center font-bold text-berry">🎉 בינגו! סיימת במקום {me.place}!</p>
          )}
          {me && me.remaining === 0 && me.place == null && (
            <p className="text-center">סיימת את הכרטיס! 👏 המקומות על הפודיום כבר נתפסו, אבל כל הכבוד!</p>
          )}
          {active && (
            <button className="btn btn-gold py-3 text-lg" onClick={checkMissed}>
              🔍 האם פספסתי מספר?
            </button>
          )}
        </section>
      )}

      {room.status === "finished" && (
        <p className="text-center text-plum/70">מחכים לסיבוב נוסף? המנהל/ת יכולים להתחיל משחק חדש 💕</p>
      )}

      {room.status !== "lobby" && <NumberHistory drawn={room.drawn} />}
      <PlayersList
        players={players}
        meId={session.playerId}
        title={room.status === "lobby" ? "מי כבר כאן?" : "השחקנים"}
        showProgress={room.status !== "lobby"}
      />
    </Shell>
  );
}
