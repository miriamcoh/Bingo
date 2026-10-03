// Everything the kid says, with timing (in frames, relative to the scene).
//
// Adding voice later:
// 1. Put an MP3 per line in the public/audio folder,
//    e.g. public/audio/kippah.mp3
// 2. Set `audio` below to the file name, e.g. audio: "audio/kippah.mp3"
// 3. If the recording is longer or shorter, adjust `durationInFrames`
//    (30 frames = 1 second) so the subtitles and the mouth match it.

export type SpokenLine = {
  id: string;
  text: string;
  from: number;
  durationInFrames: number;
  audio: string | null;
};

export const LINES = {
  kippah: {
    id: "kippah",
    text: "כל בוקר לפני שאנחנו קמים, יש ליטול ידיים",
    from: 92,
    durationInFrames: 80,
    audio: null,
  },
  bracha: {
    id: "bracha",
    text: "ברוך אתה ה' אלוקינו מלך העולם, אשר קידשנו במצוותיו וציוונו על נטילת ידיים",
    from: 45,
    durationInFrames: 185,
    audio: null,
  },
  goodbye: {
    id: "goodbye",
    text: "כל הכבוד חברים! נתראה בסרטון הבא!",
    from: 116,
    durationInFrames: 76,
    audio: null,
  },
} satisfies Record<string, SpokenLine>;

// How open the mouth is (0..1) while a line is being spoken.
export const talkingMouth = (frame: number, line: SpokenLine) => {
  const t = frame - line.from;
  if (t < 0 || t > line.durationInFrames) {
    return 0;
  }
  const envelope = Math.min(1, t / 4, (line.durationInFrames - t) / 4);
  const wobble =
    Math.abs(Math.sin(t * 0.55)) * (0.65 + 0.35 * Math.sin(t * 0.17 + 1));
  return envelope * (0.25 + 0.75 * wobble);
};
