// Blue (Democrat) to White (neutral) to Red (Republican)
export const DEMOCRAT_COLOR: readonly [number, number, number] = [33, 102, 172]; // #2166ac
export const NEUTRAL_COLOR: readonly [number, number, number] = [247, 247, 247]; // #f7f7f7
export const REPUBLICAN_COLOR: readonly [number, number, number] = [
  178, 24, 43,
]; // #b2182b

/**
 * Convert vote margin percentage to RGBA color.
 * Uses a diverging color scale: Red (Republican) → White (neutral) → Blue (Democrat)
 *
 * @param marginPercent - Vote margin from -100 (full Republican) to +100 (full Democrat)
 * @param opacity - Alpha value (0-255), defaults to 200
 * @returns RGBA color array
 */
export function getVotingColor(
  marginPercent: number,
  opacity: number = 200
): [number, number, number, number] {
  // Clamp margin to -100 to +100
  const clampedMargin = Math.max(-100, Math.min(100, marginPercent));

  // Normalize to 0-1 range (0 = full Republican, 0.5 = neutral, 1 = full Democrat)
  const t = (clampedMargin + 100) / 200;

  let r: number, g: number, b: number;

  if (t < 0.5) {
    // Republican side: blend from red to white
    const localT = t * 2;
    r = Math.round(
      REPUBLICAN_COLOR[0] + (NEUTRAL_COLOR[0] - REPUBLICAN_COLOR[0]) * localT
    );
    g = Math.round(
      REPUBLICAN_COLOR[1] + (NEUTRAL_COLOR[1] - REPUBLICAN_COLOR[1]) * localT
    );
    b = Math.round(
      REPUBLICAN_COLOR[2] + (NEUTRAL_COLOR[2] - REPUBLICAN_COLOR[2]) * localT
    );
  } else {
    // Democrat side: blend from white to blue
    const localT = (t - 0.5) * 2;
    r = Math.round(
      NEUTRAL_COLOR[0] + (DEMOCRAT_COLOR[0] - NEUTRAL_COLOR[0]) * localT
    );
    g = Math.round(
      NEUTRAL_COLOR[1] + (DEMOCRAT_COLOR[1] - NEUTRAL_COLOR[1]) * localT
    );
    b = Math.round(
      NEUTRAL_COLOR[2] + (DEMOCRAT_COLOR[2] - NEUTRAL_COLOR[2]) * localT
    );
  }

  return [r, g, b, opacity];
}

// For colorblind accessibility: alternative purple-orange scale
const ORANGE: readonly [number, number, number] = [230, 97, 1];
const PURPLE: readonly [number, number, number] = [94, 60, 153];

/**
 * Alternative colorblind-friendly color scale.
 * Uses orange (Republican) to purple (Democrat).
 */
export function getAccessibleVotingColor(
  marginPercent: number,
  opacity: number = 200
): [number, number, number, number] {
  const clampedMargin = Math.max(-100, Math.min(100, marginPercent));
  const t = (clampedMargin + 100) / 200;

  const r = Math.round(ORANGE[0] + (PURPLE[0] - ORANGE[0]) * t);
  const g = Math.round(ORANGE[1] + (PURPLE[1] - ORANGE[1]) * t);
  const b = Math.round(ORANGE[2] + (PURPLE[2] - ORANGE[2]) * t);

  return [r, g, b, opacity];
}
