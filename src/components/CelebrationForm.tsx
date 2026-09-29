"use client";

import { useState } from "react";
import { THEMES } from "@/lib/theme";
import type { ThemeId } from "@/lib/types";

export interface Celebration {
  name: string;
  age: number | null;
  theme: ThemeId;
}

/** טופס למנהל: שם בעל/ת השמחה, גיל ועיצוב */
export function CelebrationForm({
  initial,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
  onThemePreview,
}: {
  initial?: Partial<Celebration>;
  submitLabel: string;
  busy: boolean;
  onSubmit: (c: Celebration) => void;
  onCancel?: () => void;
  onThemePreview?: (t: ThemeId) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [age, setAge] = useState(initial?.age != null ? String(initial.age) : "");
  const [theme, setTheme] = useState<ThemeId>(initial?.theme ?? "pink");
  const [error, setError] = useState("");

  function pickTheme(t: ThemeId) {
    setTheme(t);
    onThemePreview?.(t);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return setError("איך קוראים לחוגג/ת? 🎂");
    const ageNum = age.trim() === "" ? null : Number(age);
    if (ageNum != null && (!Number.isInteger(ageNum) || ageNum < 0 || ageNum > 120)) {
      return setError("הגיל צריך להיות מספר בין 0 ל-120");
    }
    setError("");
    onSubmit({ name: cleanName, age: ageNum, theme });
  }

  return (
    <form onSubmit={submit} className="card-surface flex flex-col gap-5 p-5 animate-rise">
      <h2 className="text-center font-display text-2xl font-bold text-hot">למי חוגגים? 🎉</h2>

      <div className="flex gap-3">
        <label className="flex min-w-0 flex-[3] flex-col gap-2">
          <span className="font-bold">שם החוגג/ת</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="למשל: אילה"
            className="rounded-full border-2 border-petal bg-white px-5 py-3 text-lg outline-none focus:border-hot"
          />
        </label>
        <label className="flex min-w-0 flex-[1] flex-col gap-2">
          <span className="font-bold">גיל</span>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            maxLength={3}
            placeholder="1"
            className="w-full rounded-full border-2 border-petal bg-white px-3 py-3 text-center text-lg outline-none focus:border-hot"
          />
        </label>
      </div>

      <fieldset>
        <legend className="mb-2 font-bold">עיצוב</legend>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => pickTheme(t.id)}
              aria-pressed={theme === t.id}
              className={`flex flex-col items-center gap-2 rounded-2xl p-3 transition active:scale-95 ${
                theme === t.id ? "bg-powder ring-4 ring-hot" : "bg-blush ring-1 ring-petal"
              }`}
            >
              <span className="flex -space-x-2 space-x-reverse" aria-hidden>
                {t.swatch.map((c) => (
                  <span key={c} className="h-8 w-8 rounded-full ring-2 ring-white shadow" style={{ background: c }} />
                ))}
              </span>
              <span className="font-bold">{t.name}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-center font-bold text-berry">{error}</p>}

      <button className="btn btn-primary py-4 text-xl" disabled={busy}>
        {busy ? "רגע..." : submitLabel}
      </button>
      {onCancel && (
        <button type="button" className="text-sm text-plum/60 underline" onClick={onCancel}>
          ביטול
        </button>
      )}
    </form>
  );
}
