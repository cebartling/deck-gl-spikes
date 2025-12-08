import { useFlightFilterStore } from '../../../stores/flightFilterStore';
import type { FilterMode } from '../../../types/flightFilter';

const FILTER_MODES: { value: FilterMode; label: string }[] = [
  { value: 'both', label: 'All Routes' },
  { value: 'origin', label: 'Departures' },
  { value: 'destination', label: 'Arrivals' },
];

export function FilterModeSelector() {
  const selectedAirport = useFlightFilterStore(
    (state) => state.selectedAirport
  );
  const filterMode = useFlightFilterStore((state) => state.filterMode);
  const setFilterMode = useFlightFilterStore((state) => state.setFilterMode);

  // Only show when an airport is selected
  if (!selectedAirport) return null;

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
        Show Routes
      </div>

      <div className="flex gap-1">
        {FILTER_MODES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterMode(value)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filterMode === value
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
