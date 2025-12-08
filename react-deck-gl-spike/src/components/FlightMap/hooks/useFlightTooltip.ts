import { useState, useCallback } from 'react';
import type { FlightRoute } from '../../../types/flight';

interface TooltipState {
  route: FlightRoute | null;
  x: number;
  y: number;
}

interface HoverInfo {
  object?: FlightRoute;
  x: number;
  y: number;
}

export function useFlightTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>({
    route: null,
    x: 0,
    y: 0,
  });

  const handleHover = useCallback((info: HoverInfo) => {
    if (info.object) {
      setTooltip({
        route: info.object,
        x: info.x,
        y: info.y,
      });
    } else {
      setTooltip((prev) => ({
        ...prev,
        route: null,
      }));
    }
  }, []);

  const clearTooltip = useCallback(() => {
    setTooltip((prev) => ({ ...prev, route: null }));
  }, []);

  return {
    tooltip,
    hoveredRouteId: tooltip.route?.id ?? null,
    handleHover,
    clearTooltip,
  };
}
