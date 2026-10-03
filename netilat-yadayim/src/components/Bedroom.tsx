import React from "react";
import { random } from "remotion";
import { COLORS } from "./Kid";

// The bedroom, in screen coordinates (1920 x 1080).
const O = COLORS.outline;

const SmallStar: React.FC<{ x: number; y: number; r: number }> = ({
  x,
  y,
  r,
}) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${x + rad * Math.cos(a)},${y + rad * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={pts} fill="#FFD9A0" opacity={0.7} />;
};

const Sun: React.FC<{ y: number; frame: number }> = ({ y, frame }) => (
  <g transform={`translate(360 ${y})`}>
    <g transform={`rotate(${frame * 0.6})`}>
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d="M 0 -78 L 0 -102"
          transform={`rotate(${i * 30})`}
          stroke="#FFB627"
          strokeWidth={10}
          strokeLinecap="round"
        />
      ))}
    </g>
    <circle r={62} fill="#FFD23F" stroke="#F29E1F" strokeWidth={5} />
    <circle cx={-20} cy={-8} r={6} fill={O} />
    <circle cx={20} cy={-8} r={6} fill={O} />
    <circle cx={-34} cy={12} r={9} fill="#FF9F6E" opacity={0.6} />
    <circle cx={34} cy={12} r={9} fill="#FF9F6E" opacity={0.6} />
    <path
      d="M -18 14 Q 0 32 18 14"
      stroke={O}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

export const BedroomBackground: React.FC<{ frame: number; sunY: number }> = ({
  frame,
  sunY,
}) => (
  <g>
    <defs>
      <linearGradient id="bed-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8FD3FF" />
        <stop offset="1" stopColor="#FFE3A3" />
      </linearGradient>
      <clipPath id="bed-window">
        <rect x={185} y={155} width={350} height={310} rx={10} />
      </clipPath>
    </defs>

    {/* wall + wallpaper stars */}
    <rect x={0} y={0} width={1920} height={780} fill="#FFE9C7" />
    {Array.from({ length: 40 }, (_, i) => {
      const col = i % 10;
      const row = Math.floor(i / 10);
      return (
        <SmallStar
          key={i}
          x={col * 200 + (row % 2) * 100 + 60}
          y={row * 170 + 70 + random(`wall-${i}`) * 20}
          r={12}
        />
      );
    })}

    {/* floor */}
    <rect x={0} y={760} width={1920} height={320} fill="#E2A869" />
    {[820, 900, 990].map((y, r) => (
      <g key={y}>
        <line x1={0} x2={1920} y1={y} y2={y} stroke="#C98D52" strokeWidth={4} />
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={i}
            x1={i * 360 + r * 140}
            x2={i * 360 + r * 140}
            y1={y}
            y2={y + (r === 2 ? 90 : r === 1 ? 90 : 80)}
            stroke="#C98D52"
            strokeWidth={4}
          />
        ))}
      </g>
    ))}
    <rect
      x={0}
      y={752}
      width={1920}
      height={18}
      fill="#FFF4E0"
      stroke={O}
      strokeWidth={3}
    />

    {/* rug */}
    <ellipse
      cx={820}
      cy={960}
      rx={330}
      ry={62}
      fill="#F7A8B8"
      stroke={O}
      strokeWidth={4}
    />
    <ellipse
      cx={820}
      cy={960}
      rx={260}
      ry={42}
      fill="none"
      stroke="#FFF"
      strokeWidth={6}
      strokeDasharray="18 14"
    />

    {/* window with the rising sun */}
    <rect
      x={170}
      y={140}
      width={380}
      height={340}
      rx={18}
      fill="#FFFFFF"
      stroke={O}
      strokeWidth={5}
    />
    <g clipPath="url(#bed-window)">
      <rect x={185} y={155} width={350} height={310} fill="url(#bed-sky)" />
      <Sun y={sunY} frame={frame} />
      <ellipse cx={460} cy={225} rx={50} ry={20} fill="white" opacity={0.9} />
      <ellipse cx={490} cy={212} rx={30} ry={18} fill="white" opacity={0.9} />
      <ellipse cx={260} cy={440} rx={130} ry={40} fill="#9ED98B" />
      <ellipse cx={470} cy={450} rx={120} ry={45} fill="#7CC97A" />
    </g>
    <line x1={360} x2={360} y1={155} y2={465} stroke="white" strokeWidth={12} />
    <line x1={185} x2={535} y1={310} y2={310} stroke="white" strokeWidth={12} />
    <rect
      x={150}
      y={470}
      width={420}
      height={24}
      rx={8}
      fill="#FFF4E0"
      stroke={O}
      strokeWidth={4}
    />
    {/* curtains */}
    <path
      d="M 130 120 L 230 120 Q 210 300 240 500 Q 180 520 130 500 Z"
      fill="#FF8FA3"
      stroke={O}
      strokeWidth={4}
    />
    <path
      d="M 590 120 L 490 120 Q 510 300 480 500 Q 540 520 590 500 Z"
      fill="#FF8FA3"
      stroke={O}
      strokeWidth={4}
    />
    <rect
      x={110}
      y={108}
      width={500}
      height={18}
      rx={9}
      fill="#B5683A"
      stroke={O}
      strokeWidth={4}
    />

    {/* morning light */}
    <polygon
      points="185,465 535,465 900,1080 420,1080"
      fill="#FFF6C8"
      opacity={0.25}
    />

    {/* framed rainbow picture */}
    <rect
      x={760}
      y={190}
      width={240}
      height={170}
      rx={10}
      fill="#FFFDF5"
      stroke="#B5683A"
      strokeWidth={12}
    />
    {["#FF6B6B", "#FFB84D", "#FFE066", "#7ED957", "#5BC0F8"].map((c, i) => (
      <path
        key={c}
        d={`M ${800 + i * 10} 330 A ${80 - i * 10} ${80 - i * 10} 0 0 1 ${960 - i * 10} 330`}
        stroke={c}
        strokeWidth={10}
        fill="none"
      />
    ))}
  </g>
);

// The dresser (nightstand) next to the bed.
export const Nightstand: React.FC = () => (
  <g>
    <rect
      x={1390}
      y={530}
      width={180}
      height={235}
      rx={10}
      fill="#F6B26B"
      stroke={O}
      strokeWidth={5}
    />
    <rect
      x={1375}
      y={514}
      width={210}
      height={20}
      rx={8}
      fill="#E8964B"
      stroke={O}
      strokeWidth={5}
    />
    <rect
      x={1410}
      y={560}
      width={140}
      height={80}
      rx={8}
      fill="#FFC98A"
      stroke={O}
      strokeWidth={4}
    />
    <rect
      x={1410}
      y={660}
      width={140}
      height={80}
      rx={8}
      fill="#FFC98A"
      stroke={O}
      strokeWidth={4}
    />
    <circle
      cx={1480}
      cy={600}
      r={8}
      fill="#B5683A"
      stroke={O}
      strokeWidth={3}
    />
    <circle
      cx={1480}
      cy={700}
      r={8}
      fill="#B5683A"
      stroke={O}
      strokeWidth={3}
    />
    {/* little alarm clock */}
    <g transform="translate(1540 482)">
      <circle r={30} fill="#FF7A7A" stroke={O} strokeWidth={4} />
      <circle r={22} fill="white" stroke={O} strokeWidth={2} />
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={-14}
        stroke={O}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <line
        x1={0}
        y1={0}
        x2={10}
        y2={4}
        stroke={O}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle
        cx={-20}
        cy={-26}
        r={8}
        fill="#FFD23F"
        stroke={O}
        strokeWidth={3}
      />
      <circle
        cx={20}
        cy={-26}
        r={8}
        fill="#FFD23F"
        stroke={O}
        strokeWidth={3}
      />
    </g>
  </g>
);

// Back of the bed: headboard, frame, mattress and pillow.
export const BedBack: React.FC = () => (
  <g>
    <path
      d="M 1300 770 L 1300 500 Q 1300 460 1335 460 Q 1370 460 1370 500 L 1370 770 Z"
      fill="#B5683A"
      stroke={O}
      strokeWidth={5}
    />
    <circle
      cx={1335}
      cy={510}
      r={12}
      fill="#FFD23F"
      stroke={O}
      strokeWidth={3}
    />
    <rect
      x={530}
      y={680}
      width={790}
      height={60}
      rx={10}
      fill="#C77D4A"
      stroke={O}
      strokeWidth={5}
    />
    <rect
      x={540}
      y={740}
      width={30}
      height={30}
      fill="#B5683A"
      stroke={O}
      strokeWidth={4}
    />
    <rect
      x={1270}
      y={740}
      width={30}
      height={30}
      fill="#B5683A"
      stroke={O}
      strokeWidth={4}
    />
    <rect
      x={540}
      y={622}
      width={770}
      height={66}
      rx={18}
      fill="#FFFFFF"
      stroke={O}
      strokeWidth={5}
    />
    <ellipse
      cx={1228}
      cy={606}
      rx={78}
      ry={36}
      fill="#FFFFFF"
      stroke={O}
      strokeWidth={5}
    />
    <path
      d="M 1170 600 Q 1228 590 1286 604"
      stroke="#E5D3C0"
      strokeWidth={4}
      fill="none"
    />
  </g>
);

// Blanket over the kid's legs. `endX` is where it stops (follows the kid).
export const Blanket: React.FC<{ endX: number }> = ({ endX }) => (
  <g>
    <path
      d={`M 545 630 Q 560 612 600 618 L ${endX - 30} 616 Q ${endX} 618 ${endX} 645 L ${endX} 745 Q ${(545 + endX) / 2} 760 545 745 Z`}
      fill="#FF9EAA"
      stroke={O}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path
      d={`M ${endX - 36} 618 L ${endX - 36} 748`}
      stroke="#FFFFFF"
      strokeWidth={18}
    />
    {Array.from({ length: 14 }, (_, i) => {
      const x = 590 + i * 55;
      return x < endX - 60 ? (
        <circle
          key={i}
          cx={x}
          cy={660 + (i % 3) * 30}
          r={9}
          fill="#FFFFFF"
          opacity={0.85}
        />
      ) : null;
    })}
    <rect
      x={520}
      y={560}
      width={45}
      height={210}
      rx={14}
      fill="#B5683A"
      stroke={O}
      strokeWidth={5}
    />
  </g>
);
