export function ArcLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-gray-900/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/10">
      <h3 className="text-white text-sm font-medium mb-3">Flight Routes</h3>

      {/* Direction indicator */}
      <div className="mb-3">
        <span className="text-xs text-gray-400 block mb-1">Direction</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <div className="h-0.5 w-10 bg-gradient-to-r from-cyan-400 to-pink-500" />
          <div className="w-3 h-3 rounded-full bg-pink-500" />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>Origin</span>
          <span>Destination</span>
        </div>
      </div>

      {/* Width indicator */}
      <div>
        <span className="text-xs text-gray-400 block mb-1">
          Flight Frequency
        </span>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-gray-400 rounded" />
          <span className="text-xs text-gray-500">Low</span>
          <div className="h-1.5 w-6 bg-gray-400 rounded" />
          <span className="text-xs text-gray-500">High</span>
        </div>
      </div>
    </div>
  );
}
