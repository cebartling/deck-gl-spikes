const DEPTH_LABELS = {
  shallow: 'Shallow',
  deep: 'Deep',
  min: '0',
  max: '700 km',
} as const;

export function ColorLegend() {
  return (
    <div
      className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-md z-10"
      role="region"
      aria-labelledby="color-legend-title"
    >
      <h4
        id="color-legend-title"
        className="text-sm font-semibold mb-2 text-gray-700"
      >
        Depth
      </h4>
      <div className="flex flex-col gap-1">
        {/* Gradient bar */}
        <div
          className="h-4 w-32 rounded"
          style={{
            background:
              'linear-gradient(to right, #FFFF00, #FFC800, #FF8C00, #FF4500, #FF0000, #8B0000)',
          }}
          role="img"
          aria-label="Color gradient from yellow (shallow) to dark red (deep)"
        />
        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-700">
          <span>{DEPTH_LABELS.shallow}</span>
          <span>{DEPTH_LABELS.deep}</span>
        </div>
        {/* Depth markers */}
        <div className="flex justify-between text-xs text-gray-600">
          <span>{DEPTH_LABELS.min}</span>
          <span>{DEPTH_LABELS.max}</span>
        </div>
      </div>
    </div>
  );
}
