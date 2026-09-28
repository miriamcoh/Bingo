import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const clean = (v: string | undefined) => v?.trim().replace(/^["']|["']$/g, "").trim();
const looksLikeUrl = (v: string) => /^https?:\/\//i.test(v) || /\.supabase\.(co|in)/i.test(v);

let rawUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
let key = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
// אם שני הערכים הוחלפו ביניהם ב-Vercel – מחליפים בחזרה
if (rawUrl && key && !looksLikeUrl(rawUrl) && looksLikeUrl(key)) {
  [rawUrl, key] = [key, rawUrl];
}

/** תחילת הערך שהתקבל, כדי להציג במסך השגיאה */
export const receivedUrlPreview = rawUrl ? rawUrl.slice(0, 40) : "";

// מקבלים גם כתובת שהודבקה עם תוספות (למשל ‎/rest/v1/‎) או בלי https – משאירים רק את הבסיס
function normalizeUrl(u: string): string | null {
  try {
    const parsed = new URL(/^https?:\/\//i.test(u) ? u : `https://${u}`);
    if (!parsed.hostname.includes(".")) return null;
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.origin : null;
  } catch {
    return null;
  }
}

const url = rawUrl ? normalizeUrl(rawUrl) : null;

export const configProblem: "missing" | "bad-url" | null =
  !rawUrl || !key ? "missing" : !url ? "bad-url" : null;
export const isConfigured = configProblem === null;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !key) {
    throw new Error("Supabase env vars are missing");
  }
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 20 } },
    });
  }
  return client;
}

/** קריאה לפונקציה בשרת שלעולם לא "נתקעת": מחזירה שגיאה במקום לזרוק, ומוותרת אחרי 15 שניות */
export async function rpc<T = unknown>(
  fn: string,
  args?: Record<string, unknown>,
): Promise<{ data: T | null; error: { message: string } | null }> {
  try {
    const call = getSupabase().rpc(fn, args);
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), 15000),
    );
    const { data, error } = await Promise.race([call, timeout]);
    return { data: (data as T) ?? null, error: error ? { message: error.message } : null };
  } catch (e) {
    return { data: null, error: { message: e instanceof Error ? e.message : String(e) } };
  }
}
