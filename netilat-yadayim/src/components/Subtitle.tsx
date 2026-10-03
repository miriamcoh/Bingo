import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { fontFamily } from "../fonts";
import { SpokenLine } from "../lines";

// Splits the line into words and decides which word is being said,
// based on how far we are into the line. Longer words get more time.
const wordBounds = (words: string[]) => {
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  return weights.map((w) => {
    const start = acc / total;
    acc += w;
    return [start, acc / total] as const;
  });
};

export const Subtitle: React.FC<{ line: SpokenLine }> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showFrom = line.from - 8;
  if (frame < showFrom) {
    return null;
  }

  const words = line.text.split(" ");
  const bounds = wordBounds(words);
  const progress = (frame - line.from) / line.durationInFrames;
  const end = line.from + line.durationInFrames;

  const appear = spring({
    frame: frame - showFrom,
    fps,
    config: { damping: 14 },
  });
  const disappear = interpolate(frame, [end + 22, end + 34], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 50,
      }}
    >
      <div
        style={{
          direction: "rtl",
          textAlign: "right",
          fontFamily,
          fontSize: 58,
          fontWeight: 700,
          lineHeight: 1.4,
          color: "#3A2C5C",
          background: "rgba(255, 255, 255, 0.94)",
          border: "6px solid #FFC94D",
          borderRadius: 44,
          padding: "16px 40px",
          maxWidth: 1560,
          boxShadow: "0 10px 0 rgba(58, 44, 92, 0.18)",
          opacity: Math.min(1, appear) * disappear,
          transform: `translateY(${(1 - appear) * 50}px) scale(${0.9 + 0.1 * appear})`,
        }}
      >
        {words.map((word, i) => {
          const [start, stop] = bounds[i];
          const isDone = progress >= stop;
          const isActive = !isDone && progress >= start;
          const pop = isActive
            ? interpolate(
                progress,
                [start, start + (stop - start) * 0.35],
                [1, 1.08],
                { extrapolateRight: "clamp" },
              )
            : 1;
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  color: isActive ? "#FF6B2C" : "#3A2C5C",
                  opacity: isActive || isDone ? 1 : 0.32,
                  margin: "0 12px",
                  transform: `scale(${pop})`,
                }}
              >
                {word}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Subtitle + (optional) voice recording for one line.
// When `line.audio` is set in lines.ts, the MP3 plays automatically.
export const SpokenLineView: React.FC<{ line: SpokenLine }> = ({ line }) => (
  <>
    {line.audio ? (
      <Sequence from={line.from} layout="none">
        <Audio src={staticFile(line.audio)} />
      </Sequence>
    ) : null}
    <Subtitle line={line} />
  </>
);
