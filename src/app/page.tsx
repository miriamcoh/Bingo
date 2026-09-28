"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { useToast } from "@/components/Toast";
import { rpc } from "@/lib/supabase";
import { setHostToken } from "@/lib/storage";
import { errorMessage } from "@/lib/errors";

export default function Home() {
  const router = useRouter();
  const toast = useToast();
  const [creating, setCreating] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [code, setCode] = useState("");

  async function createRoom() {
    setCreating(true);
    const { data, error } = await rpc("create_room");
    if (error || !data) {
      toast(errorMessage(error), "warn");
      setCreating(false);
      return;
    }
    const { code: roomCode, host_token } = data as { code: string; host_token: string };
    setHostToken(roomCode, host_token);
    router.push(`/host/${roomCode}`);
  }

  function joinByCode(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean.length >= 4) router.push(`/play/${clean}`);
  }

  return (
    <Shell>
      <section className="mt-4 flex flex-col items-center text-center">
        <div className="flex -space-x-3 space-x-reverse">
          {["bunny", "bear", "kitty", "chick"].map((id) => (
            <Avatar key={id} id={id} size={56} className="animate-float ring-4 ring-white" />
          ))}
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-hot sm:text-5xl">
          אילה בת שנה!
        </h1>
        <p className="mt-2 text-lg">בואו לשחק בינגו של יום הולדת 🎉</p>
      </section>

      <section className="card-surface mt-4 flex flex-col gap-4 p-6">
        <button className="btn btn-primary py-5 text-xl" onClick={() => setShowJoin((s) => !s)}>
          🎈 אני שחקן/ית
        </button>
        {showJoin && (
          <form onSubmit={joinByCode} className="flex flex-col gap-2 animate-rise">
            <p className="text-sm text-plum/70">
              קיבלת קישור? פשוט לוחצים עליו. אפשר גם להקליד את קוד החדר:
            </p>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="קוד חדר"
                dir="ltr"
                maxLength={8}
                autoCapitalize="characters"
                className="min-w-0 flex-1 rounded-full border-2 border-petal bg-white px-4 py-3 text-center text-xl font-bold tracking-widest uppercase outline-none focus:border-hot"
              />
              <button className="btn btn-gold" type="submit">
                כניסה
              </button>
            </div>
          </form>
        )}
        <button className="btn btn-soft py-4 text-lg" onClick={createRoom} disabled={creating}>
          {creating ? "יוצרים חדר..." : "👑 אני מנהל/ת הבינגו"}
        </button>
      </section>
    </Shell>
  );
}
