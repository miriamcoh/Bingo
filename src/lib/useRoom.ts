"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase, isConfigured } from "./supabase";
import type { Player, Room } from "./types";

type LoadState = "loading" | "ready" | "notfound" | "error";

/**
 * מביא את החדר ואת רשימת השחקנים ומתעדכן בזמן אמת.
 * Realtime של Supabase הוא הערוץ הראשי; בנוסף יש רענון כל כמה שניות
 * ובכל חזרה לאפליקציה, כי טלפונים שנכנסים לשינה מאבדים את החיבור.
 */
export function useRoom(code: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const requestId = useRef(0);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    if (!isConfigured) return;
    const id = ++requestId.current;
    const supabase = getSupabase();
    const { data: r, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code.toUpperCase())
      .maybeSingle();
    if (id !== requestId.current) return;
    if (error) {
      setState((s) => (s === "ready" ? s : "error"));
      return;
    }
    if (!r) {
      setState("notfound");
      return;
    }
    const { data: ps, error: pErr } = await supabase
      .from("players")
      .select("*")
      .eq("room_id", r.id)
      .order("created_at");
    if (id !== requestId.current || pErr) return;
    setRoom(r as Room);
    setPlayers((ps ?? []) as Player[]);
    setState("ready");
  }, [code]);

  const scheduleRefresh = useCallback(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => void refresh(), 120);
  }, [refresh]);

  useEffect(() => {
    void refresh();
    const interval = setInterval(() => void refresh(), 4000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onVisible);
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [refresh]);

  const roomId = room?.id;
  useEffect(() => {
    if (!roomId) return;
    const supabase = getSupabase();
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
        scheduleRefresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomId}` },
        scheduleRefresh,
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [roomId, scheduleRefresh]);

  return { room, players, state, refresh };
}
