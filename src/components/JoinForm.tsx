"use client";

import { useState } from "react";
import { AVATARS, Avatar } from "./Avatar";
import { useToast } from "./Toast";
import { rpc } from "@/lib/supabase";
import { errorMessage } from "@/lib/errors";
import { setPlayerSession, type PlayerSession } from "@/lib/storage";

export function JoinForm({
  code,
  title,
  onJoined,
}: {
  code: string;
  title: string;
  onJoined: (s: PlayerSession) => void;
}) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast("איך קוראים לך? 🙂", "warn");
    if (!avatar) return toast("בחרו דמות חמודה 🐰", "warn");
    setBusy(true);
    const { data, error } = await rpc("join_room", {
      p_code: code,
      p_name: name.trim(),
      p_avatar: avatar,
    });
    setBusy(false);
    if (error || !data) return toast(errorMessage(error), "warn");
    const { player_id, token } = data as { player_id: string; token: string };
    const session = { playerId: player_id, token };
    setPlayerSession(code, session);
    onJoined(session);
  }

  return (
    <form onSubmit={submit} className="card-surface flex flex-col gap-5 p-5">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-hot">🎂 {title}!</h2>
        <p className="mt-1 font-bold">ברוכים הבאים לבינגו 🎈</p>
        <p className="mt-1 text-plum/70">כותבים שם ובוחרים דמות</p>
      </div>
      <label className="flex flex-col gap-2">
        <span className="font-bold">השם שלי</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="למשל: סבתא רותי"
          className="rounded-full border-2 border-petal bg-white px-5 py-3 text-lg outline-none focus:border-hot"
          autoComplete="nickname"
        />
      </label>
      <fieldset>
        <legend className="mb-2 font-bold">הדמות שלי</legend>
        <div className="grid grid-cols-4 gap-2">
          {AVATARS.map((a) => (
            <button
              type="button"
              key={a.id}
              onClick={() => setAvatar(a.id)}
              aria-pressed={avatar === a.id}
              className={`flex flex-col items-center gap-1 rounded-2xl p-1.5 transition active:scale-95 ${
                avatar === a.id ? "bg-powder ring-4 ring-hot" : "bg-blush"
              }`}
            >
              <Avatar id={a.id} size={56} />
              <span className="text-xs">{a.name}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <button className="btn btn-primary py-4 text-xl" disabled={busy}>
        {busy ? "מצטרפים..." : "יאללה, מצטרפים! 🎉"}
      </button>
    </form>
  );
}
