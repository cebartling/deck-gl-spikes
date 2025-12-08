// Source color: cyan/teal (departure)
const SOURCE_COLOR: [number, number, number, number] = [0, 255, 255, 180];

// Target color: magenta/pink (arrival)
const TARGET_COLOR: [number, number, number, number] = [255, 0, 128, 180];

// Alternative: blue to orange for colorblind accessibility
const SOURCE_COLOR_ALT: [number, number, number, number] = [66, 133, 244, 180];
const TARGET_COLOR_ALT: [number, number, number, number] = [255, 152, 0, 180];

export function getSourceColor(
  frequency: number,
  maxFrequency: number,
  accessible = false
): [number, number, number, number] {
  const baseColor = accessible ? SOURCE_COLOR_ALT : SOURCE_COLOR;
  // Increase opacity for higher frequency routes
  const normalizedFreq = maxFrequency > 0 ? frequency / maxFrequency : 0;
  const opacity = Math.round(100 + normalizedFreq * 155);
  return [baseColor[0], baseColor[1], baseColor[2], opacity];
}

export function getTargetColor(
  frequency: number,
  maxFrequency: number,
  accessible = false
): [number, number, number, number] {
  const baseColor = accessible ? TARGET_COLOR_ALT : TARGET_COLOR;
  const normalizedFreq = maxFrequency > 0 ? frequency / maxFrequency : 0;
  const opacity = Math.round(100 + normalizedFreq * 155);
  return [baseColor[0], baseColor[1], baseColor[2], opacity];
}
