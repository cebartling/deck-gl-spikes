const MAGNITUDE_SAMPLES = [3, 5, 7, 9];

/**
 * Calculate display size for legend circles.
 * Uses a simplified scale for visual consistency in the legend.
 */
function getDisplaySize(magnitude: number): number {
  const minSize = 8;
  const maxSize = 40;
  const minMag = 3;
  const maxMag = 9;

  const normalized = (magnitude - minMag) / (maxMag - minMag);
  return Math.round(minSize + normalized * (maxSize - minSize));
}

export function SizeLegend() {
  return (
    <div
      className="absolute bottom-24 left-4 bg-gray-900/80 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/10 z-10"
      role="region"
      aria-labelledby="legend-title"
    >
      <h4 id="legend-title" className="text-sm font-semibold mb-2 text-gray-100">Magnitude</h4>
      <ul className="flex items-end gap-3" aria-labelledby="legend-title">
        {MAGNITUDE_SAMPLES.map((mag) => {
          const size = getDisplaySize(mag);
          return (
            <li
              key={mag}
              className="flex flex-col items-center"
              aria-label={`Magnitude ${mag}`}
            >
              <div
                className="rounded-full bg-orange-500/60 border border-orange-600"
                style={{ width: size, height: size }}
                aria-label={`Circle representing magnitude ${mag}`}
              />
              <span className="text-xs mt-1 text-gray-300">{mag}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
