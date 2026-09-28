import type { ReactNode } from "react";

// 12 דמויות מקוריות – איורי SVG פשוטים שציירנו כאן, בלי שום דמות מוגנת.

const INK = "#4a2340";
const CHEEK = "#ff8fbf";

function Eyes({ y = 52, dx = 12, r = 5, color = INK }: { y?: number; dx?: number; r?: number; color?: string }) {
  return (
    <g>
      <circle cx={50 - dx} cy={y} r={r} fill={color} />
      <circle cx={50 + dx} cy={y} r={r} fill={color} />
      <circle cx={50 - dx + 1.6} cy={y - 1.8} r={r * 0.35} fill="#fff" />
      <circle cx={50 + dx + 1.6} cy={y - 1.8} r={r * 0.35} fill="#fff" />
    </g>
  );
}

function Cheeks({ y = 62, dx = 21 }: { y?: number; dx?: number }) {
  return (
    <g opacity={0.75}>
      <ellipse cx={50 - dx} cy={y} rx={6} ry={4} fill={CHEEK} />
      <ellipse cx={50 + dx} cy={y} rx={6} ry={4} fill={CHEEK} />
    </g>
  );
}

function Smile({ y = 64 }: { y?: number }) {
  return (
    <path
      d={`M44 ${y} Q47 ${y + 4} 50 ${y} Q53 ${y + 4} 56 ${y}`}
      fill="none"
      stroke={INK}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  );
}

function Nose({ y = 59, color = INK }: { y?: number; color?: string }) {
  return <ellipse cx={50} cy={y} rx={4} ry={3} fill={color} />;
}

export interface AnimalDef {
  id: string;
  name: string;
  bg: string;
  art: ReactNode;
}

export const AVATARS: AnimalDef[] = [
  {
    id: "bunny",
    name: "ארנבונת",
    bg: "#ffe4f1",
    art: (
      <>
        <ellipse cx={36} cy={24} rx={8} ry={20} fill="#fff" stroke="#f5b5d3" strokeWidth={2} />
        <ellipse cx={64} cy={24} rx={8} ry={20} fill="#fff" stroke="#f5b5d3" strokeWidth={2} />
        <ellipse cx={36} cy={25} rx={4} ry={14} fill="#ffc2dd" />
        <ellipse cx={64} cy={25} rx={4} ry={14} fill="#ffc2dd" />
        <circle cx={50} cy={60} r={28} fill="#fff" stroke="#f5b5d3" strokeWidth={2} />
        <Eyes y={56} dx={11} />
        <Cheeks y={65} dx={18} />
        <Nose y={62} color="#ff7aa8" />
        <Smile y={67} />
      </>
    ),
  },
  {
    id: "bear",
    name: "דובי",
    bg: "#fff1dc",
    art: (
      <>
        <circle cx={26} cy={32} r={11} fill="#c68b5e" />
        <circle cx={74} cy={32} r={11} fill="#c68b5e" />
        <circle cx={26} cy={32} r={6} fill="#f2c9a5" />
        <circle cx={74} cy={32} r={6} fill="#f2c9a5" />
        <circle cx={50} cy={56} r={30} fill="#c68b5e" />
        <ellipse cx={50} cy={65} rx={13} ry={10} fill="#f2d7ba" />
        <Eyes y={50} />
        <Cheeks y={60} dx={22} />
        <Nose y={61} />
        <Smile y={66} />
      </>
    ),
  },
  {
    id: "kitty",
    name: "חתלתולה",
    bg: "#ffeede",
    art: (
      <>
        <path d="M22 44 L26 14 L46 30 Z" fill="#f6b26b" />
        <path d="M78 44 L74 14 L54 30 Z" fill="#f6b26b" />
        <path d="M27 36 L29 21 L40 30 Z" fill="#ffc2dd" />
        <path d="M73 36 L71 21 L60 30 Z" fill="#ffc2dd" />
        <circle cx={50} cy={56} r={30} fill="#f6b26b" />
        <path d="M44 28 Q50 36 56 28" fill="none" stroke="#e08a3c" strokeWidth={3} strokeLinecap="round" />
        <Eyes y={52} />
        <Cheeks />
        <path d="M47 59 L53 59 L50 62 Z" fill="#ff7aa8" />
        <Smile y={63} />
        <g stroke={INK} strokeWidth={1.4} strokeLinecap="round">
          <line x1={20} y1={60} x2={33} y2={62} />
          <line x1={20} y1={67} x2={33} y2={65} />
          <line x1={80} y1={60} x2={67} y2={62} />
          <line x1={80} y1={67} x2={67} y2={65} />
        </g>
      </>
    ),
  },
  {
    id: "puppy",
    name: "כלבלב",
    bg: "#f3ecff",
    art: (
      <>
        <circle cx={50} cy={55} r={29} fill="#f7e2c8" />
        <ellipse cx={22} cy={52} rx={9} ry={20} fill="#a8744f" transform="rotate(18 22 52)" />
        <ellipse cx={78} cy={52} rx={9} ry={20} fill="#a8744f" transform="rotate(-18 78 52)" />
        <ellipse cx={61} cy={47} rx={9} ry={8} fill="#e7c49c" />
        <Eyes y={50} dx={11} />
        <Cheeks y={62} dx={19} />
        <ellipse cx={50} cy={60} rx={5} ry={3.6} fill={INK} />
        <Smile y={65} />
        <ellipse cx={50} cy={71} rx={3.5} ry={4} fill="#ff7aa8" />
      </>
    ),
  },
  {
    id: "panda",
    name: "פנדה",
    bg: "#e8f7ef",
    art: (
      <>
        <circle cx={27} cy={31} r={10} fill={INK} />
        <circle cx={73} cy={31} r={10} fill={INK} />
        <circle cx={50} cy={56} r={30} fill="#fff" stroke="#d9d0d6" strokeWidth={2} />
        <ellipse cx={38} cy={53} rx={8} ry={10} fill={INK} transform="rotate(25 38 53)" />
        <ellipse cx={62} cy={53} rx={8} ry={10} fill={INK} transform="rotate(-25 62 53)" />
        <Eyes y={52} dx={12} r={3.4} color="#fff" />
        <circle cx={38} cy={52} r={1.8} fill={INK} />
        <circle cx={62} cy={52} r={1.8} fill={INK} />
        <Cheeks y={65} dx={22} />
        <Nose y={63} />
        <Smile y={67} />
      </>
    ),
  },
  {
    id: "fox",
    name: "שועלה",
    bg: "#fff4e0",
    art: (
      <>
        <path d="M20 46 L24 12 L46 32 Z" fill="#f0843c" />
        <path d="M80 46 L76 12 L54 32 Z" fill="#f0843c" />
        <path d="M26 36 L27 22 L38 31 Z" fill="#fff" />
        <path d="M74 36 L73 22 L62 31 Z" fill="#fff" />
        <circle cx={50} cy={56} r={30} fill="#f0843c" />
        <path d="M22 58 Q36 58 50 76 Q64 58 78 58 Q74 84 50 86 Q26 84 22 58 Z" fill="#fff" />
        <Eyes y={51} />
        <Cheeks y={62} dx={23} />
        <Nose y={68} />
        <Smile y={72} />
      </>
    ),
  },
  {
    id: "piggy",
    name: "חזרזירה",
    bg: "#ffe0ec",
    art: (
      <>
        <path d="M24 40 L22 18 L42 30 Z" fill="#ff9cc0" />
        <path d="M76 40 L78 18 L58 30 Z" fill="#ff9cc0" />
        <circle cx={50} cy={56} r={30} fill="#ffc4da" />
        <Eyes y={48} />
        <Cheeks y={60} dx={23} />
        <ellipse cx={50} cy={64} rx={12} ry={8.5} fill="#ff9cc0" />
        <ellipse cx={45.5} cy={64} rx={2.2} ry={3} fill="#c2507f" />
        <ellipse cx={54.5} cy={64} rx={2.2} ry={3} fill="#c2507f" />
      </>
    ),
  },
  {
    id: "chick",
    name: "אפרוחה",
    bg: "#fff8d6",
    art: (
      <>
        <path d="M46 26 Q44 12 50 16 Q52 8 56 18 Q62 12 56 27 Z" fill="#ffc933" />
        <circle cx={50} cy={56} r={30} fill="#ffe066" />
        <Eyes y={50} />
        <Cheeks y={60} dx={22} />
        <path d="M43 58 L57 58 L50 67 Z" fill="#ff9f40" />
        <path d="M22 66 Q14 58 20 52" fill="none" stroke="#ffc933" strokeWidth={4} strokeLinecap="round" />
        <path d="M78 66 Q86 58 80 52" fill="none" stroke="#ffc933" strokeWidth={4} strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "froggy",
    name: "צפרדעית",
    bg: "#e6f9e1",
    art: (
      <>
        <circle cx={33} cy={34} r={12} fill="#8fdc7e" />
        <circle cx={67} cy={34} r={12} fill="#8fdc7e" />
        <ellipse cx={50} cy={60} rx={34} ry={26} fill="#8fdc7e" />
        <circle cx={33} cy={34} r={7} fill="#fff" />
        <circle cx={67} cy={34} r={7} fill="#fff" />
        <Eyes y={34} dx={17} r={4} />
        <Cheeks y={62} dx={22} />
        <path d="M34 64 Q50 78 66 64" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
        <circle cx={46} cy={55} r={1.3} fill={INK} />
        <circle cx={54} cy={55} r={1.3} fill={INK} />
      </>
    ),
  },
  {
    id: "koala",
    name: "קואלה",
    bg: "#eaf1fb",
    art: (
      <>
        <circle cx={22} cy={40} r={15} fill="#aeb8c7" />
        <circle cx={78} cy={40} r={15} fill="#aeb8c7" />
        <circle cx={22} cy={40} r={9} fill="#f3e3ee" />
        <circle cx={78} cy={40} r={9} fill="#f3e3ee" />
        <circle cx={50} cy={57} r={28} fill="#c5cdd9" />
        <Eyes y={52} dx={12} />
        <Cheeks y={64} dx={20} />
        <ellipse cx={50} cy={62} rx={7} ry={9} fill="#5b5064" />
        <path d="M46 73 Q50 76 54 73" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "lion",
    name: "אריה",
    bg: "#fff3d6",
    art: (
      <>
        <g fill="#f2a33a">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={50 + Math.cos(a) * 30} cy={56 + Math.sin(a) * 30} r={12} />;
          })}
        </g>
        <circle cx={50} cy={56} r={28} fill="#ffd77a" />
        <circle cx={31} cy={35} r={6} fill="#ffd77a" />
        <circle cx={69} cy={35} r={6} fill="#ffd77a" />
        <Eyes y={52} dx={11} />
        <Cheeks y={62} dx={19} />
        <path d="M46 59 L54 59 L50 63 Z" fill="#c9602a" />
        <Smile y={65} />
      </>
    ),
  },
  {
    id: "penguin",
    name: "פינגווינית",
    bg: "#e5f3ff",
    art: (
      <>
        <circle cx={50} cy={56} r={31} fill="#3d4a6b" />
        <path d="M50 44 Q34 30 26 50 Q24 74 50 84 Q76 74 74 50 Q66 30 50 44 Z" fill="#fff" />
        <Eyes y={54} dx={11} />
        <Cheeks y={64} dx={18} />
        <path d="M44 61 L56 61 L50 69 Z" fill="#ffa53d" />
        <path d="M60 26 Q66 18 72 26 Q66 30 60 26 Z" fill="#ff7aa8" />
        <circle cx={66} cy={25} r={2.4} fill="#fff" />
      </>
    ),
  },
];

const BY_ID = new Map(AVATARS.map((a) => [a.id, a]));

export function avatarName(id: string) {
  return BY_ID.get(id)?.name ?? "";
}

export function Avatar({
  id,
  size = 48,
  className = "",
  ring = false,
}: {
  id: string;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  const def = BY_ID.get(id) ?? AVATARS[0];
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={def.name}
      className={`shrink-0 rounded-full ${ring ? "ring-4 ring-gold" : ""} ${className}`}
      style={{ background: def.bg }}
    >
      {def.art}
    </svg>
  );
}
