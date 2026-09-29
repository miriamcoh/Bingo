"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useToast } from "./Toast";

export function InviteCard({ code, title, compact = false }: { code: string; title: string; compact?: boolean }) {
  const toast = useToast();
  const [link, setLink] = useState("");
  const [open, setOpen] = useState(!compact);

  useEffect(() => {
    setLink(`${window.location.origin}/play/${code}`);
  }, [code]);

  const message = `בואו לשחק בינגו – ${title}! 🎂🎈\n${link}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      toast("הקישור הועתק 💕");
    } catch {
      toast("לא הצלחנו להעתיק, אפשר לסמן ולהעתיק ידנית", "warn");
    }
  }

  if (compact && !open) {
    return (
      <button className="btn btn-soft w-full" onClick={() => setOpen(true)}>
        💌 להזמין עוד אורחים (קוד {code})
      </button>
    );
  }

  return (
    <section className="card-surface flex flex-col items-center gap-3 p-5 text-center">
      <h3 className="font-display text-lg font-bold">מזמינים את האורחים 💌</h3>
      {link && (
        <div className="rounded-2xl bg-white p-3 ring-4 ring-powder">
          <QRCodeSVG value={link} size={compact ? 140 : 180} fgColor="#1f2937" />
        </div>
      )}
      <p className="text-sm text-plum/70">סורקים עם המצלמה, או שולחים את הקישור בוואטסאפ</p>
      <p className="font-display text-3xl font-bold tracking-[0.3em] text-berry" dir="ltr">
        {code}
      </p>
      <p className="w-full truncate rounded-full bg-blush px-3 py-2 text-sm" dir="ltr">
        {link}
      </p>
      <div className="flex w-full flex-wrap justify-center gap-2">
        <a
          className="btn flex-1 bg-[#25d366] text-white shadow-md"
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
        >
          שליחה בוואטסאפ
        </a>
        <button className="btn btn-soft flex-1" onClick={copy}>
          העתקת קישור
        </button>
      </div>
      {compact && (
        <button className="text-sm text-plum/60 underline" onClick={() => setOpen(false)}>
          סגירה
        </button>
      )}
    </section>
  );
}
