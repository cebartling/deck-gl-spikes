import {
  useCountyVotingViewStore,
  US_VIEW_BOUNDS,
} from '../../stores/countyVotingViewStore';

export function ZoomControls() {
  const viewState = useCountyVotingViewStore((state) => state.viewState);
  const zoomIn = useCountyVotingViewStore((state) => state.zoomIn);
  const zoomOut = useCountyVotingViewStore((state) => state.zoomOut);
  const resetView = useCountyVotingViewStore((state) => state.resetView);

  const isAtMaxZoom = viewState.zoom >= US_VIEW_BOUNDS.maxZoom;
  const isAtMinZoom = viewState.zoom <= US_VIEW_BOUNDS.minZoom;

  return (
    <div
      className="absolute top-4 right-4 flex flex-col gap-1 z-10"
      role="group"
      aria-label="Map zoom controls"
    >
      <button
        onClick={zoomIn}
        disabled={isAtMaxZoom}
        className="w-8 h-8 bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg border border-white/10 hover:bg-gray-800/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-bold text-gray-100 touch-manipulation transition-colors"
        aria-label="Zoom in"
        type="button"
      >
        +
      </button>
      <button
        onClick={zoomOut}
        disabled={isAtMinZoom}
        className="w-8 h-8 bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg border border-white/10 hover:bg-gray-800/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-bold text-gray-100 touch-manipulation transition-colors"
        aria-label="Zoom out"
        type="button"
      >
        −
      </button>
      <button
        onClick={resetView}
        className="w-8 h-8 bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg border border-white/10 hover:bg-gray-800/90 flex items-center justify-center text-sm text-gray-100 touch-manipulation transition-colors"
        aria-label="Reset view"
        type="button"
      >
        ⌂
      </button>
    </div>
  );
}
