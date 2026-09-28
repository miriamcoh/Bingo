import { Avatar } from "./Avatar";
import { sortPlayers, type Player } from "@/lib/types";

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function PlayersList({
  players,
  meId,
  title = "השחקנים",
  showProgress = true,
}: {
  players: Player[];
  meId?: string;
  title?: string;
  showProgress?: boolean;
}) {
  const sorted = sortPlayers(players);
  return (
    <section className="card-surface p-4">
      <h3 className="mb-3 flex items-center justify-between font-display text-lg">
        <span>{title}</span>
        <span className="rounded-full bg-powder px-3 py-0.5 text-sm text-berry">{players.length}</span>
      </h3>
      {sorted.length === 0 ? (
        <p className="text-center text-plum/60">עוד אין שחקנים... שלחו את הקישור! 💌</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((p) => (
            <li
              key={p.id}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${
                p.id === meId ? "bg-powder ring-2 ring-rose" : "bg-blush"
              }`}
            >
              <Avatar id={p.avatar} size={40} ring={p.place != null} />
              <span className="min-w-0 flex-1 truncate font-bold">
                {p.name}
                {p.id === meId && <span className="font-normal text-plum/60"> (אני)</span>}
              </span>
              {showProgress &&
                (p.place != null ? (
                  <span className="whitespace-nowrap rounded-full bg-gold/30 px-3 py-1 text-sm font-bold text-plum">
                    {MEDALS[p.place] ?? "🏅"} מקום {p.place}
                  </span>
                ) : p.remaining === 0 ? (
                  <span className="whitespace-nowrap text-sm text-plum/70">סיים/ה ✓</span>
                ) : (
                  <span className="flex items-center gap-2 whitespace-nowrap text-sm">
                    <span className="hidden h-2 w-16 overflow-hidden rounded-full bg-white sm:block" dir="ltr">
                      <span
                        className="block h-full rounded-full bg-rose"
                        style={{ width: `${((10 - p.remaining) / 10) * 100}%` }}
                      />
                    </span>
                    <span>
                      נשארו <b className="text-berry">{p.remaining}</b>
                    </span>
                  </span>
                ))}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
