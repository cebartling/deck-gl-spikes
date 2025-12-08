import { useCallback } from 'react';
import { useFlightMapViewStore } from '../../stores';

const MIN_ZOOM = 2;
const MAX_ZOOM = 12;

export function ZoomControls() {
  const viewState = useFlightMapViewStore((state) => state.viewState);
  const setViewState = useFlightMapViewStore((state) => state.setViewState);
  const resetView = useFlightMapViewStore((state) => state.resetView);

  const handleZoomIn = useCallback(() => {
    setViewState({
      ...viewState,
      zoom: Math.min(viewState.zoom + 1, MAX_ZOOM),
      transitionDuration: 300,
    });
  }, [viewState, setViewState]);

  const handleZoomOut = useCallback(() => {
    setViewState({
      ...viewState,
      zoom: Math.max(viewState.zoom - 1, MIN_ZOOM),
      transitionDuration: 300,
    });
  }, [viewState, setViewState]);

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-gray-800/90 hover:bg-gray-700 text-white rounded-lg
                   flex items-center justify-center shadow-lg backdrop-blur-sm
                   transition-colors"
        aria-label="Zoom in"
      >
        <span className="text-xl font-light">+</span>
      </button>

      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-gray-800/90 hover:bg-gray-700 text-white rounded-lg
                   flex items-center justify-center shadow-lg backdrop-blur-sm
                   transition-colors"
        aria-label="Zoom out"
      >
        <span className="text-xl font-light">&minus;</span>
      </button>

      <button
        onClick={resetView}
        className="w-10 h-10 bg-gray-800/90 hover:bg-gray-700 text-white rounded-lg
                   flex items-center justify-center shadow-lg backdrop-blur-sm
                   transition-colors mt-2"
        aria-label="Reset view"
        title="Reset to initial view"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>
    </div>
  );
}
