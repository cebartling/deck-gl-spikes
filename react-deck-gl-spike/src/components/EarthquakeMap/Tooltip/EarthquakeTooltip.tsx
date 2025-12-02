import type { Earthquake } from '../../../types/earthquake';
import { TooltipContent } from './TooltipContent';
import { formatMagnitude, formatDepth, formatDateTime } from '../../../utils/formatters';

interface TooltipProps {
  earthquake: Earthquake;
  x: number;
  y: number;
}

export function EarthquakeTooltip({ earthquake, x, y }: TooltipProps) {
  // Offset tooltip from cursor
  const offsetX = 15;
  const offsetY = -10;

  const magnitude = formatMagnitude(earthquake.magnitude);
  const depth = formatDepth(earthquake.depth);
  const dateTime = formatDateTime(earthquake.timestamp);

  return (
    <div
      role="tooltip"
      aria-label={`Earthquake details: Magnitude ${earthquake.magnitude}`}
      className="absolute pointer-events-none z-50 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-200 min-w-[200px] max-w-[300px]"
      style={{
        left: x + offsetX,
        top: y + offsetY,
      }}
      data-testid="earthquake-tooltip"
    >
      <span className="sr-only">
        Magnitude {magnitude.value} {magnitude.descriptor} earthquake.
        Location: {earthquake.location}.
        Depth: {depth.value}.
        Occurred on {dateTime.date} at {dateTime.time}.
      </span>
      <TooltipContent earthquake={earthquake} />
    </div>
  );
}
