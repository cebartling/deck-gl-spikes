import type { Earthquake } from '../../../types/earthquake';
import {
  formatMagnitude,
  formatDepth,
  formatDateTime,
  formatCoordinates,
} from '../../../utils/formatters';
import { depthToColorMultiStop } from '../layers/depthColorScale';

interface TooltipContentProps {
  earthquake: Earthquake;
}

function getDepthColorCSS(depth: number): string {
  const [r, g, b] = depthToColorMultiStop(depth);
  return `rgb(${r}, ${g}, ${b})`;
}

export function TooltipContent({ earthquake }: TooltipContentProps) {
  const magnitude = formatMagnitude(earthquake.magnitude);
  const depth = formatDepth(earthquake.depth);
  const dateTime = formatDateTime(earthquake.timestamp);
  const depthColor = getDepthColorCSS(earthquake.depth);

  return (
    <div className="space-y-2" data-testid="tooltip-content">
      {/* Color indicator bar */}
      <div
        className="h-1 w-full rounded-full"
        style={{ backgroundColor: depthColor }}
        data-testid="depth-color-indicator"
      />

      {/* Header: Magnitude */}
      <div className="flex items-baseline gap-2">
        <span
          className="text-2xl font-bold text-gray-100"
          data-testid="magnitude-value"
        >
          M{magnitude.value}
        </span>
        <span
          className="text-sm text-gray-400"
          data-testid="magnitude-descriptor"
        >
          {magnitude.descriptor}
        </span>
      </div>

      {/* Location */}
      <div>
        <div className="font-medium text-gray-200" data-testid="location">
          {earthquake.location}
        </div>
        <div className="text-xs text-gray-400" data-testid="coordinates">
          {formatCoordinates(earthquake.longitude, earthquake.latitude)}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm border-t border-white/10 pt-2">
        <div data-testid="depth-info">
          <span className="text-gray-400">Depth:</span>
          <span className="ml-1 font-medium text-gray-200">{depth.value}</span>
          <span className="text-xs text-gray-500 ml-1">
            ({depth.classification})
          </span>
        </div>

        <div data-testid="date-info">
          <span className="text-gray-400">Date:</span>
          <span className="ml-1 font-medium text-gray-200">
            {dateTime.date}
          </span>
        </div>

        <div className="col-span-2" data-testid="time-info">
          <span className="text-gray-400">Time:</span>
          <span className="ml-1 font-medium text-gray-200">
            {dateTime.time}
          </span>
          {dateTime.relative && (
            <span className="text-xs text-gray-500 ml-2">
              ({dateTime.relative})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
