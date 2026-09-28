// בלונים ונצנצים ברקע – קישוט בלבד, לא חוסם לחיצות

function Balloon({ color, className, delay }: { color: string; className: string; delay: string }) {
  return (
    <svg
      viewBox="0 0 60 120"
      className={`absolute animate-float ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <path d="M30 74 Q26 90 32 100 Q38 110 30 120" fill="none" stroke="#e4a9c6" strokeWidth={1.5} />
      <ellipse cx={30} cy={36} rx={24} ry={30} fill={color} />
      <path d="M26 66 L34 66 L30 73 Z" fill={color} />
      <ellipse cx={21} cy={24} rx={5} ry={9} fill="#fff" opacity={0.45} transform="rotate(-20 21 24)" />
    </svg>
  );
}

const SPARKLES = [
  { top: "12%", left: "8%", delay: "0s", size: "text-xl" },
  { top: "22%", left: "88%", delay: "0.6s", size: "text-2xl" },
  { top: "48%", left: "4%", delay: "1.2s", size: "text-lg" },
  { top: "64%", left: "92%", delay: "0.3s", size: "text-xl" },
  { top: "86%", left: "12%", delay: "1.8s", size: "text-2xl" },
  { top: "80%", left: "78%", delay: "0.9s", size: "text-lg" },
];

export function Decorations() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <Balloon color="#ff8cc6" className="-left-3 top-16 w-14 opacity-70 md:w-20" delay="0s" />
      <Balloon color="#f2c14e" className="left-8 top-40 w-10 opacity-60 md:w-14" delay="1.5s" />
      <Balloon color="#ff4fa3" className="-right-2 top-24 w-12 opacity-70 md:w-20" delay="0.8s" />
      <Balloon color="#ffd9ea" className="right-10 top-72 w-10 opacity-80 md:w-16" delay="2.2s" />
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className={`absolute animate-twinkle text-gold ${s.size}`}
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
