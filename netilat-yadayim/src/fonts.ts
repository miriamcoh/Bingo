import { loadFont } from "@remotion/google-fonts/Rubik";

// Rubik: rounded and friendly, great for kids.
// "hebrew" brings the Hebrew letters; "latin" brings punctuation like ! , '
export const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800"],
  subsets: ["hebrew", "latin"],
});
