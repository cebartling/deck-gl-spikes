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
    <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-md z-10">
      <h4 className="text-sm font-semibold mb-2 text-gray-700">Magnitude</h4>
      <div className="flex items-end gap-3">
        {MAGNITUDE_SAMPLES.map((mag) => {
          const size = getDisplaySize(mag);
          return (
            <div key={mag} className="flex flex-col items-center">
              <div
                className="rounded-full bg-orange-500/60 border border-orange-600"
                style={{ width: size, height: size }}
              />
              <span className="text-xs mt-1 text-gray-600">{mag}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
