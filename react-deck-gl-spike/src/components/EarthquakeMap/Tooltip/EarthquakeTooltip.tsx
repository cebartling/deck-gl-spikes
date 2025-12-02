import type { Earthquake } from '../../../types/earthquake';

interface TooltipProps {
  earthquake: Earthquake;
  x: number;
  y: number;
}

export function EarthquakeTooltip({ earthquake, x, y }: TooltipProps) {
  // Offset tooltip from cursor
  const offsetX = 10;
  const offsetY = 10;

  return (
    <div
      role="tooltip"
      aria-live="polite"
      className="absolute pointer-events-none z-50 bg-white/95 px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm"
      style={{
        left: x + offsetX,
        top: y + offsetY,
      }}
      data-testid="earthquake-tooltip"
    >
      <span className="sr-only">Earthquake details:</span>
      <div className="font-semibold text-gray-900">
        M{earthquake.magnitude.toFixed(1)}
      </div>
      <div className="text-gray-600">{earthquake.location}</div>
    </div>
  );
}
