import { useMemo } from 'react';
import { TooltipContent } from './TooltipContent';
import type { FlightRoute } from '../../../types/flight';

interface FlightTooltipProps {
  route: FlightRoute;
  x: number;
  y: number;
}

export function FlightTooltip({ route, x, y }: FlightTooltipProps) {
  // Calculate tooltip position to keep it on screen
  const position = useMemo(() => {
    const TOOLTIP_WIDTH = 280;
    const TOOLTIP_HEIGHT = 250;
    const OFFSET = 15;
    const VIEWPORT_PADDING = 10;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Determine horizontal position
    let left = x + OFFSET;
    if (left + TOOLTIP_WIDTH > viewportWidth - VIEWPORT_PADDING) {
      left = x - TOOLTIP_WIDTH - OFFSET;
    }

    // Determine vertical position
    let top = y + OFFSET;
    if (top + TOOLTIP_HEIGHT > viewportHeight - VIEWPORT_PADDING) {
      top = y - TOOLTIP_HEIGHT - OFFSET;
    }

    // Ensure minimum bounds
    left = Math.max(VIEWPORT_PADDING, left);
    top = Math.max(VIEWPORT_PADDING, top);

    return { left, top };
  }, [x, y]);

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      <div
        className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg
                   shadow-xl p-4 min-w-[280px] animate-fade-in"
      >
        <TooltipContent route={route} />
      </div>
    </div>
  );
}
