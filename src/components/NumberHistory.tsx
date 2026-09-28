/** היסטוריית המספרים – החדש ביותר ראשון */
export function NumberHistory({ drawn, title = "מספרים שיצאו" }: { drawn: number[]; title?: string }) {
  const list = [...drawn].reverse();
  return (
    <section className="card-surface p-4">
      <h3 className="mb-3 flex items-center justify-between font-display text-lg">
        <span>{title}</span>
        <span className="rounded-full bg-powder px-3 py-0.5 text-sm text-berry">{drawn.length} / 100</span>
      </h3>
      {list.length === 0 ? (
        <p className="text-center text-plum/60">עוד לא הוגרל אף מספר</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {list.map((n, i) => (
            <span
              key={n}
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                i === 0 ? "bg-hot text-white ring-4 ring-gold" : "bg-powder text-berry"
              }`}
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

/** לוח 1–100 גדול להקרנה במסך המנהל */
export function NumberBoard({ drawn }: { drawn: number[] }) {
  const set = new Set(drawn);
  const last = drawn[drawn.length - 1];
  return (
    <div className="grid grid-cols-10 gap-1 sm:gap-1.5" dir="ltr">
      {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
        <span
          key={n}
          className={`flex aspect-square items-center justify-center rounded-full text-xs font-bold sm:text-sm lg:text-base ${
            n === last
              ? "bg-hot text-white ring-2 ring-gold"
              : set.has(n)
                ? "bg-rose text-white"
                : "bg-white/70 text-plum/35"
          }`}
        >
          {n}
        </span>
      ))}
    </div>
  );
}
