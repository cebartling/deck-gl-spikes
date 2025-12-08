import { useEffect, useCallback } from 'react';
import { useFlightMapViewStore } from '../../../stores';

const PAN_STEP = 0.5; // Degrees
const ZOOM_STEP = 0.5;
const MIN_ZOOM = 2;
const MAX_ZOOM = 12;

export function useKeyboardNavigation() {
  const viewState = useFlightMapViewStore((state) => state.viewState);
  const setViewState = useFlightMapViewStore((state) => state.setViewState);
  const resetView = useFlightMapViewStore((state) => state.resetView);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't handle keyboard events when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setViewState({
            ...viewState,
            latitude: viewState.latitude + PAN_STEP,
            transitionDuration: 100,
          });
          break;
        case 'ArrowDown':
          event.preventDefault();
          setViewState({
            ...viewState,
            latitude: viewState.latitude - PAN_STEP,
            transitionDuration: 100,
          });
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setViewState({
            ...viewState,
            longitude: viewState.longitude - PAN_STEP,
            transitionDuration: 100,
          });
          break;
        case 'ArrowRight':
          event.preventDefault();
          setViewState({
            ...viewState,
            longitude: viewState.longitude + PAN_STEP,
            transitionDuration: 100,
          });
          break;
        case '+':
        case '=':
          event.preventDefault();
          setViewState({
            ...viewState,
            zoom: Math.min(viewState.zoom + ZOOM_STEP, MAX_ZOOM),
            transitionDuration: 100,
          });
          break;
        case '-':
        case '_':
          event.preventDefault();
          setViewState({
            ...viewState,
            zoom: Math.max(viewState.zoom - ZOOM_STEP, MIN_ZOOM),
            transitionDuration: 100,
          });
          break;
        case 'Home':
          event.preventDefault();
          resetView();
          break;
      }
    },
    [viewState, setViewState, resetView]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
