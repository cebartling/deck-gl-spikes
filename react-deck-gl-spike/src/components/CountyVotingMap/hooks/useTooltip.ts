import { useState, useCallback } from 'react';
import type { PickingInfo } from '@deck.gl/core';
import type { CountyFeature } from '../../../types/county';

export interface TooltipState {
  object: CountyFeature | null;
  x: number;
  y: number;
}

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const onHover = useCallback((info: PickingInfo<CountyFeature>) => {
    if (info.object && info.picked) {
      setTooltip({
        object: info.object,
        x: info.x,
        y: info.y,
      });
    } else {
      setTooltip(null);
    }
  }, []);

  const clearTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  return {
    tooltip,
    onHover,
    clearTooltip,
    hoveredFips: tooltip?.object?.properties.fips ?? null,
  };
}
