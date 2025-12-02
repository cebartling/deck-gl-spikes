interface EarthquakeStatsProps {
  totalCount: number;
  filteredCount: number;
  isFiltered: boolean;
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  );
}

export function EarthquakeStats({
  totalCount,
  filteredCount,
  isFiltered,
}: EarthquakeStatsProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="bg-gray-900/80 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-white/10 text-sm"
      data-testid="earthquake-stats"
    >
      <span className="sr-only">
        Showing {filteredCount} of {totalCount} earthquakes
        {isFiltered ? ' (filtered)' : ''}
      </span>

      <div className="flex items-center gap-2">
        <span
          className="font-semibold text-gray-100"
          data-testid="filtered-count"
        >
          {filteredCount.toLocaleString()}
        </span>
        <span className="text-gray-300">
          earthquake{filteredCount !== 1 ? 's' : ''}
        </span>

        {isFiltered && (
          <span className="text-gray-400" data-testid="total-count">
            of {totalCount.toLocaleString()}
          </span>
        )}
      </div>

      {isFiltered && (
        <div
          className="flex items-center gap-1 mt-1 text-xs text-blue-400"
          data-testid="filter-indicator"
        >
          <FilterIcon className="w-3 h-3" />
          <span>Filter active</span>
        </div>
      )}
    </div>
  );
}
