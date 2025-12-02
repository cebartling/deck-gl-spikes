interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onResetView,
}: ZoomControlsProps) {
  return (
    <div
      className="absolute top-4 right-4 flex flex-col gap-1 z-10"
      role="group"
      aria-label="Map zoom controls"
    >
      <button
        onClick={onZoomIn}
        className="w-8 h-8 bg-white rounded shadow hover:bg-gray-100 flex items-center justify-center text-lg font-bold touch-manipulation"
        aria-label="Zoom in"
        type="button"
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        className="w-8 h-8 bg-white rounded shadow hover:bg-gray-100 flex items-center justify-center text-lg font-bold touch-manipulation"
        aria-label="Zoom out"
        type="button"
      >
        −
      </button>
      <button
        onClick={onResetView}
        className="w-8 h-8 bg-white rounded shadow hover:bg-gray-100 flex items-center justify-center text-sm touch-manipulation"
        aria-label="Reset view"
        type="button"
      >
        ⌂
      </button>
    </div>
  );
}
