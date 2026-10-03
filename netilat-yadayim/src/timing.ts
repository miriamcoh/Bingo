// All durations are in frames (30 frames = 1 second).
export const FPS = 30;

// Length of the soft fade between two scenes.
export const FADE = 15;

// Each scene is a bit longer than its "visible" time because the
// fade overlaps the next scene by FADE frames.
export const SCENES = {
  wakeUp: 135, // ~4s
  kippah: 195, // ~6s
  walk: 105, // ~3s
  washing: 375, // ~12s
  bracha: 255, // ~8s
  goodbye: 210, // ~6s
};

const sceneCount = Object.keys(SCENES).length;

export const TOTAL_FRAMES =
  Object.values(SCENES).reduce((a, b) => a + b, 0) - FADE * (sceneCount - 1);
