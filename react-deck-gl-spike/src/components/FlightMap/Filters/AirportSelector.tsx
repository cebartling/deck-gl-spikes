import { useState, useCallback, useRef, useEffect } from 'react';
import { useFlightFilterStore } from '../../../stores/flightFilterStore';
import { useFlightMapViewStore } from '../../../stores/flightMapViewStore';
import { useAirportSearch } from '../hooks/useAirportSearch';
import type { Airport } from '../../../types/flight';

interface AirportSelectorProps {
  airports: Airport[];
}

export function AirportSelector({ airports }: AirportSelectorProps) {
  const selectedAirport = useFlightFilterStore(
    (state) => state.selectedAirport
  );
  const setSelectedAirport = useFlightFilterStore(
    (state) => state.setSelectedAirport
  );
  const clearFilter = useFlightFilterStore((state) => state.clearFilter);
  const flyTo = useFlightMapViewStore((state) => state.flyTo);
  const resetView = useFlightMapViewStore((state) => state.resetView);

  const { searchResults, searchQuery, setSearchQuery, clearSearch } =
    useAirportSearch(airports);

  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected airport name for display
  const selectedAirportData = airports.find((a) => a.code === selectedAirport);

  const handleSelect = useCallback(
    (airport: Airport) => {
      setSelectedAirport(airport.code);
      setIsOpen(false);
      clearSearch();

      // Fly to selected airport
      flyTo({
        longitude: airport.longitude,
        latitude: airport.latitude,
        zoom: 6,
      });
    },
    [setSelectedAirport, flyTo, clearSearch]
  );

  const handleClear = useCallback(() => {
    clearFilter();
    clearSearch();
    resetView();
  }, [clearFilter, clearSearch, resetView]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg w-72 relative ${
        isOpen ? 'z-50' : ''
      }`}
    >
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Filter by Airport
      </label>

      <div ref={dropdownRef} className="relative">
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchQuery : selectedAirportData?.name || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search airports..."
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg
                       px-3 py-2 text-sm focus:outline-none focus:ring-2
                       focus:ring-blue-500 focus:border-transparent pr-20"
          />

          {/* Selected airport badge */}
          {selectedAirport && !isOpen && (
            <span
              className="absolute right-10 top-1/2 -translate-y-1/2
                           bg-cyan-600 text-white text-xs px-2 py-0.5 rounded"
            >
              {selectedAirport}
            </span>
          )}

          {/* Clear button */}
          {selectedAirport && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2
                         text-gray-400 hover:text-white"
              aria-label="Clear filter"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div
            className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600
                          rounded-lg shadow-xl max-h-64 overflow-auto"
          >
            {/* All Airports Option */}
            <button
              onClick={handleClear}
              className="w-full px-3 py-2 text-left text-sm text-gray-300
                         hover:bg-gray-700 border-b border-gray-700"
            >
              All Airports
            </button>

            {/* Search Results */}
            {searchResults.length > 0 ? (
              searchResults.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => handleSelect(airport)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-700 ${
                    airport.code === selectedAirport ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-mono font-bold">
                      {airport.code}
                    </span>
                    <span className="text-white text-sm truncate">
                      {airport.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {airport.city}, {airport.country}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-gray-400 text-center">
                No airports found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
