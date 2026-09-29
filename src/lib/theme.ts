"use client";

import { useEffect } from "react";
import type { ThemeId } from "./types";

export const THEMES: { id: ThemeId; name: string; swatch: [string, string, string] }[] = [
  { id: "pink", name: "ורוד חגיגי", swatch: ["#fff2f8", "#ff2e93", "#f2c14e"] },
  { id: "blue", name: "לבן ותכלת", swatch: ["#ffffff", "#2ea3e6", "#b8d9f0"] },
];

/** מחיל את העיצוב של החדר על כל הדף */
export function useApplyTheme(theme: ThemeId | undefined) {
  useEffect(() => {
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
  }, [theme]);
}

/** צבע מתוך העיצוב הנוכחי (לקונפטי וכו') */
export function themeColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--t-${name}`).trim();
  return v || fallback;
}
