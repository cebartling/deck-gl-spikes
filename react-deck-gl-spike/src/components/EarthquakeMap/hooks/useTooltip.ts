import { useState, useCallback, useRef, useEffect } from 'react';
import type { PickingInfo } from '@deck.gl/core';
import type { Earthquake } from '../../../types/earthquake';

export interface TooltipState {
  object: Earthquake;
  x: number;
  y: number;
}

// Delay before dismissing tooltip (prevents flickering when moving between adjacent points)
const DISMISS_DELAY_MS = 50;

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const dismissTimerRef = useRef<number | null>(null);

  // Clear any pending dismiss timer
  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  // Immediately clear the tooltip
  const clearTooltip = useCallback(() => {
    clearDismissTimer();
    setTooltip(null);
  }, [clearDismissTimer]);

  const onHover = useCallback(
    (info: PickingInfo<Earthquake>) => {
      // Clear any pending dismiss when hovering
      clearDismissTimer();

      if (info.object) {
        // Show tooltip immediately
        setTooltip({
          object: info.object,
          x: info.x,
          y: info.y,
        });
      } else {
        // Small delay before dismissing to prevent flicker
        // when moving between adjacent points
        dismissTimerRef.current = window.setTimeout(() => {
          setTooltip(null);
          dismissTimerRef.current = null;
        }, DISMISS_DELAY_MS);
      }
    },
    [clearDismissTimer]
  );

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tooltip) {
        clearTooltip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tooltip, clearTooltip]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  return { tooltip, onHover, clearTooltip };
}
