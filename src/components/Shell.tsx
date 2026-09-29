import Link from "next/link";
import type { ReactNode } from "react";
import { configProblem, isConfigured, receivedUrlPreview } from "@/lib/supabase";

export function Shell({
  children,
  wide = false,
  title = "בינגו יום הולדת",
}: {
  children: ReactNode;
  wide?: boolean;
  title?: string;
}) {
  return (
    <main className={`mx-auto flex min-h-dvh w-full flex-col gap-4 px-4 pb-10 pt-4 ${wide ? "max-w-6xl" : "max-w-lg"}`}>
      <header className="flex items-center justify-center">
        <Link href="/" className="font-display text-xl font-bold text-berry">
          🎈 {title} 🎂
        </Link>
      </header>
      {isConfigured ? children : <SetupNotice />}
    </main>
  );
}

function SetupNotice() {
  return (
    <div className="card-surface p-6 text-center">
      <p className="text-4xl">🛠️</p>
      <h2 className="mt-2 font-display text-xl font-bold">עוד רגע מוכנים!</h2>
      {configProblem === "bad-url" ? (
        <p className="mt-2">
          הכתובת ב-<code dir="ltr">NEXT_PUBLIC_SUPABASE_URL</code> לא תקינה. היא צריכה להיראות כמו{" "}
          <code dir="ltr">https://abcd1234.supabase.co</code>. מתקנים ב-Vercel ומפרסמים מחדש.
          <br />
          <span className="text-sm text-plum/60">
            מה שהתקבל: <code dir="ltr">{receivedUrlPreview || "(ריק)"}</code>
          </span>
        </p>
      ) : (
      <p className="mt-2">
        חסרים המשתנים <code dir="ltr">NEXT_PUBLIC_SUPABASE_URL</code> ו-
        <code dir="ltr">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. מוסיפים אותם ב-Vercel ומפרסמים מחדש.
      </p>
      )}
    </div>
  );
}

export function CenterMessage({ emoji, title, children }: { emoji: string; title: string; children?: ReactNode }) {
  return (
    <div className="card-surface mt-8 p-6 text-center">
      <p className="text-5xl">{emoji}</p>
      <h2 className="mt-3 font-display text-xl font-bold">{title}</h2>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div className="mt-16 flex flex-col items-center gap-3 text-plum/70">
      <span className="animate-float text-5xl">🎈</span>
      <span>טוען...</span>
    </div>
  );
}
