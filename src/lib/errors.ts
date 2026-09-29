const MESSAGES: Record<string, string> = {
  ROOM_NOT_FOUND: "לא מצאנו את החדר 🤔 כדאי לבדוק את הקישור",
  NOT_DRAWN: "המספר הזה עוד לא הוגרל 🙂",
  NOT_ON_CARD: "המספר הזה לא בכרטיס שלך",
  NOT_PLAYING: "המשחק לא פעיל כרגע",
  NOT_LOBBY: "המשחק כבר התחיל",
  TIE_WINDOW: "רגע! בודקים אם יש עוד מנצחים...",
  ALL_DRAWN: "כל המספרים כבר הוגרלו!",
  NOT_HOST: "רק מי שיצר את החדר יכול לעשות את זה",
  BAD_NAME: "צריך לכתוב שם (עד 20 אותיות)",
  BAD_AVATAR: "צריך לבחור דמות",
  ROOM_FULL: "החדר מלא",
  BAD_TOKEN: "לא הצלחנו לזהות אותך, נסו לרענן את הדף",
  TIMEOUT: "השרת לא עונה 🙁 בדקו את החיבור לאינטרנט ונסו שוב",
  BAD_CELEBRANT: "צריך לכתוב את שם החוגג/ת (עד 20 אותיות)",
  BAD_AGE: "הגיל צריך להיות מספר בין 0 ל-120",
  BAD_THEME: "צריך לבחור עיצוב",
  "Could not find the function": "צריך לעדכן את מסד הנתונים: מריצים שוב את הקובץ schema.sql ב-Supabase",
};

export function errorMessage(err: unknown): string {
  const text =
    typeof err === "object" && err && "message" in err
      ? String((err as { message: unknown }).message)
      : String(err ?? "");
  for (const code of Object.keys(MESSAGES)) {
    if (text.includes(code)) return MESSAGES[code];
  }
  // מצרפים את הטקסט המקורי כדי שיהיה קל להבין מה קרה
  return `אופס, משהו השתבש 🙏 (${text.slice(0, 120)})`;
}

export function errorCode(err: unknown): string | null {
  const text =
    typeof err === "object" && err && "message" in err
      ? String((err as { message: unknown }).message)
      : "";
  return Object.keys(MESSAGES).find((c) => text.includes(c)) ?? null;
}
