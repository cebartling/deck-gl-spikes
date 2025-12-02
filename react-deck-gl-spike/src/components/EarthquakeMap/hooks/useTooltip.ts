import { useState, useCallback } from 'react';
import type { PickingInfo } from '@deck.gl/core';
import type { Earthquake } from '../../../types/earthquake';

export interface TooltipState {
  object: Earthquake;
  x: number;
  y: number;
}

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const onHover = useCallback((info: PickingInfo<Earthquake>) => {
    if (info.object) {
      setTooltip({
        object: info.object,
        x: info.x,
        y: info.y,
      });
    } else {
      setTooltip(null);
    }
  }, []);

  return { tooltip, onHover };
}
