import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

// מקבלים גם כתובת שהודבקה עם תוספות (למשל ‎/rest/v1/‎) – משאירים רק את הבסיס
function normalizeUrl(u: string): string | null {
  try {
    const parsed = new URL(u);
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
