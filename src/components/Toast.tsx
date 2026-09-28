"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Tone = "info" | "warn" | "party";
interface ToastItem {
  id: number;
  text: string;
  tone: Tone;
}

const ToastContext = createContext<(text: string, tone?: Tone, ms?: number) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((text: string, tone: Tone = "info", ms = 2600) => {
    const id = nextId++;
    setItems((list) => [...list.filter((t) => t.text !== text), { id, text, tone }].slice(-3));
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), ms);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`animate-slide-down max-w-md rounded-2xl px-5 py-3 text-center text-base font-bold shadow-xl ${
              t.tone === "party"
                ? "bg-gradient-to-l from-hot to-berry text-white ring-4 ring-gold"
                : t.tone === "warn"
                  ? "bg-white text-berry ring-2 ring-rose"
                  : "bg-white text-plum ring-2 ring-petal"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
