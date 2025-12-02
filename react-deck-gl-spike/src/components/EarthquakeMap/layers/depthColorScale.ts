// Maximum depth for scaling (deepest earthquakes ~700km)
export const MAX_DEPTH = 700;

// Color stop type for multi-stop interpolation
type ColorStop = {
  readonly depth: number;
  readonly color: readonly [number, number, number];
};

// Color stops for multi-stop interpolation
export const COLOR_STOPS: readonly ColorStop[] = [
  { depth: 0, color: [255, 255, 0] }, // Yellow
  { depth: 70, color: [255, 200, 0] }, // Gold
  { depth: 150, color: [255, 140, 0] }, // Orange
  { depth: 300, color: [255, 69, 0] }, // Red-Orange
  { depth: 500, color: [255, 0, 0] }, // Red
  { depth: 700, color: [139, 0, 0] }, // Dark Red
];

/**
 * Convert depth to RGBA color array using simple linear interpolation.
 * Yellow (shallow) → Red (deep)
 */
export function depthToColor(depth: number): [number, number, number, number] {
  const normalizedDepth = Math.min(depth / MAX_DEPTH, 1);

  // Yellow to Red interpolation
  // R: stays at 255
  // G: 255 → 0 as depth increases
  // B: 0
  // A: 180 (semi-transparent)
  return [255, Math.round(255 * (1 - normalizedDepth)), 0, 180];
}

/**
 * Multi-stop color scale for more nuanced visualization.
 * Interpolates between defined color stops for perceptually accurate depth representation.
 */
export function depthToColorMultiStop(
  depth: number
): [number, number, number, number] {
  // Handle edge cases
  if (depth <= 0) {
    return [...COLOR_STOPS[0].color, 180] as [number, number, number, number];
  }
  if (depth >= MAX_DEPTH) {
    return [...COLOR_STOPS[COLOR_STOPS.length - 1].color, 180] as [
      number,
      number,
      number,
      number,
    ];
  }

  // Find the two stops to interpolate between
  let lower = COLOR_STOPS[0];
  let upper = COLOR_STOPS[COLOR_STOPS.length - 1];

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (depth >= COLOR_STOPS[i].depth && depth < COLOR_STOPS[i + 1].depth) {
      lower = COLOR_STOPS[i];
      upper = COLOR_STOPS[i + 1];
      break;
    }
  }

  // Linear interpolation between stops
  const range = upper.depth - lower.depth;
  const t = range > 0 ? (depth - lower.depth) / range : 0;

  return [
    Math.round(lower.color[0] + t * (upper.color[0] - lower.color[0])),
    Math.round(lower.color[1] + t * (upper.color[1] - lower.color[1])),
    Math.round(lower.color[2] + t * (upper.color[2] - lower.color[2])),
    180, // Alpha
  ];
}
