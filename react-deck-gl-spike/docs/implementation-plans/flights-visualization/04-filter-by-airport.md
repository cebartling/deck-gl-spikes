# Implementation Plan: Filter by Airport

## User Story

**As a** user
**I want to** filter routes by origin or destination airport
**So that I** can focus on specific hubs

## Acceptance Criteria

- [ ] Airport selector is available
- [ ] Map updates to show only routes connected to selected airport
- [ ] Option to view all routes simultaneously

## Approach

Create a searchable airport selector component with autocomplete functionality. Filter state is managed in Zustand for cross-component access. When an airport is selected, filter routes to show only those where the selected airport is either the origin or destination. The map view transitions to center on the selected airport. An "All Airports" option allows returning to the full network view.

## Architecture

```mermaid
graph TB
    subgraph "UI Layer"
        A[AirportSelector] --> B[Search Input]
        B --> C[Autocomplete Dropdown]
        C --> D[Airport Selection]
    end

    subgraph "State Management"
        D --> E[Zustand flightFilterStore]
        E --> F[selectedAirport]
        E --> G[filterMode: origin|destination|both]
    end

    subgraph "Data Processing"
        H[All Routes] --> I[useFilteredRoutes Hook]
        F --> I
        G --> I
        I --> J[Filtered Routes]
    end

    subgraph "Visualization"
        J --> K[ArcLayer]
        F --> L[flyTo Airport]
        F --> M[Airport Marker Layer]
    end
```

## Libraries

| Library           | Purpose                           |
| ----------------- | --------------------------------- |
| `zustand`         | Filter state management           |
| `@deck.gl/core`   | FlyToInterpolator for transitions |
| `@deck.gl/layers` | IconLayer for airport markers     |
| `fuse.js`         | Fuzzy search for airport lookup   |

## Data Structures

```typescript
// src/types/flightFilter.ts

export type FilterMode = 'origin' | 'destination' | 'both';

export interface FlightFilterState {
  selectedAirport: string | null; // Airport IATA code
  filterMode: FilterMode;
}

export interface FilteredRoutesStats {
  totalRoutes: number;
  totalFlights: number;
  connectedAirports: number;
}
```

## Implementation Steps

### 1. Create Flight Filter Store

```typescript
// src/stores/flightFilterStore.ts
import { create } from 'zustand';
import type { FilterMode } from '../types/flightFilter';

interface FlightFilterStore {
  selectedAirport: string | null; // IATA code
  filterMode: FilterMode;

  setSelectedAirport: (airportCode: string | null) => void;
  setFilterMode: (mode: FilterMode) => void;
  clearFilter: () => void;
  reset: () => void;
}

const initialState = {
  selectedAirport: null,
  filterMode: 'both' as FilterMode,
};

export const useFlightFilterStore = create<FlightFilterStore>((set) => ({
  ...initialState,

  setSelectedAirport: (airportCode) => {
    set({ selectedAirport: airportCode });
  },

  setFilterMode: (mode) => {
    set({ filterMode: mode });
  },

  clearFilter: () => {
    set({ selectedAirport: null });
  },

  reset: () => set(initialState),
}));
```

### 2. Create Filtered Routes Hook

```typescript
// src/components/FlightMap/hooks/useFilteredRoutes.ts
import { useMemo } from 'react';
import type { FlightRoute, Airport } from '../../../types/flight';
import type {
  FilterMode,
  FilteredRoutesStats,
} from '../../../types/flightFilter';
import { useFlightFilterStore } from '../../../stores/flightFilterStore';

interface UseFilteredRoutesResult {
  filteredRoutes: FlightRoute[];
  stats: FilteredRoutesStats;
  isFiltered: boolean;
  selectedAirportData: Airport | null;
}

export function useFilteredRoutes(
  routes: FlightRoute[]
): UseFilteredRoutesResult {
  const selectedAirport = useFlightFilterStore(
    (state) => state.selectedAirport
  );
  const filterMode = useFlightFilterStore((state) => state.filterMode);

  const filteredRoutes = useMemo(() => {
    if (!selectedAirport) {
      return routes;
    }

    return routes.filter((route) => {
      switch (filterMode) {
        case 'origin':
          return route.origin.code === selectedAirport;
        case 'destination':
          return route.destination.code === selectedAirport;
        case 'both':
        default:
          return (
            route.origin.code === selectedAirport ||
            route.destination.code === selectedAirport
          );
      }
    });
  }, [routes, selectedAirport, filterMode]);

  const stats = useMemo((): FilteredRoutesStats => {
    const connectedAirports = new Set<string>();

    filteredRoutes.forEach((route) => {
      connectedAirports.add(route.origin.code);
      connectedAirports.add(route.destination.code);
    });

    return {
      totalRoutes: filteredRoutes.length,
      totalFlights: filteredRoutes.reduce((sum, r) => sum + r.frequency, 0),
      connectedAirports: connectedAirports.size,
    };
  }, [filteredRoutes]);

  const selectedAirportData = useMemo((): Airport | null => {
    if (!selectedAirport) return null;

    for (const route of routes) {
      if (route.origin.code === selectedAirport) {
        return route.origin;
      }
      if (route.destination.code === selectedAirport) {
        return route.destination;
      }
    }

    return null;
  }, [routes, selectedAirport]);

  return {
    filteredRoutes,
    stats,
    isFiltered: selectedAirport !== null,
    selectedAirportData,
  };
}
```

### 3. Create Airport Search Index

```typescript
// src/components/FlightMap/hooks/useAirportSearch.ts
import { useMemo, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import type { Airport } from '../../../types/flight';

interface UseAirportSearchResult {
  searchResults: Airport[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export function useAirportSearch(airports: Airport[]): UseAirportSearchResult {
  const [searchQuery, setSearchQuery] = useState('');

  // Create fuzzy search index
  const fuse = useMemo(() => {
    return new Fuse(airports, {
      keys: [
        { name: 'code', weight: 2 }, // IATA code weighted higher
        { name: 'name', weight: 1.5 },
        { name: 'city', weight: 1 },
        { name: 'country', weight: 0.5 },
      ],
      threshold: 0.3, // Fuzzy match threshold
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [airports]);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) {
      // Return top airports by default (could be sorted by popularity)
      return airports.slice(0, 10);
    }

    const results = fuse.search(searchQuery);
    return results.slice(0, 10).map((result) => result.item);
  }, [fuse, searchQuery, airports]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchResults,
    searchQuery,
    setSearchQuery,
    clearSearch,
  };
}
```

### 4. Create Airport Selector Component

```typescript
// src/components/FlightMap/Filters/AirportSelector.tsx
import { useState, useCallback, useRef, useEffect } from 'react';
import { useFlightFilterStore } from '../../../stores/flightFilterStore';
import { useFlightMapViewStore } from '../../../stores/flightMapViewStore';
import { useAirportSearch } from '../hooks/useAirportSearch';
import type { Airport } from '../../../types/flight';

interface AirportSelectorProps {
  airports: Airport[];
}

export function AirportSelector({ airports }: AirportSelectorProps) {
  const selectedAirport = useFlightFilterStore((state) => state.selectedAirport);
  const setSelectedAirport = useFlightFilterStore((state) => state.setSelectedAirport);
  const clearFilter = useFlightFilterStore((state) => state.clearFilter);
  const flyTo = useFlightMapViewStore((state) => state.flyTo);

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

    // Reset to default view
    flyTo({
      longitude: -98.5795,
      latitude: 39.8283,
      zoom: 4,
    });
  }, [clearFilter, clearSearch, flyTo]);

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
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg w-72">
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
            <span className="absolute right-10 top-1/2 -translate-y-1/2
                           bg-cyan-600 text-white text-xs px-2 py-0.5 rounded">
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600
                          rounded-lg shadow-xl max-h-64 overflow-auto">
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
```

### 5. Create Filter Mode Selector

```typescript
// src/components/FlightMap/Filters/FilterModeSelector.tsx
import { useFlightFilterStore } from '../../../stores/flightFilterStore';
import type { FilterMode } from '../../../types/flightFilter';

const FILTER_MODES: { value: FilterMode; label: string }[] = [
  { value: 'both', label: 'All Routes' },
  { value: 'origin', label: 'Departures' },
  { value: 'destination', label: 'Arrivals' },
];

export function FilterModeSelector() {
  const selectedAirport = useFlightFilterStore((state) => state.selectedAirport);
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
```

### 6. Create Filter Stats Display

```typescript
// src/components/FlightMap/Filters/FlightFilterStats.tsx
import type { FilteredRoutesStats } from '../../../types/flightFilter';
import type { Airport } from '../../../types/flight';

interface FlightFilterStatsProps {
  stats: FilteredRoutesStats;
  selectedAirport: Airport | null;
  isFiltered: boolean;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function FlightFilterStats({
  stats,
  selectedAirport,
  isFiltered,
}: FlightFilterStatsProps) {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <h3 className="text-white font-medium mb-2">
        {isFiltered && selectedAirport
          ? `${selectedAirport.code} - ${selectedAirport.city}`
          : 'Network Summary'}
      </h3>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Routes</span>
          <span className="text-white">{formatNumber(stats.totalRoutes)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Weekly Flights</span>
          <span className="text-white">{formatNumber(stats.totalFlights)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Connected Airports</span>
          <span className="text-white">{formatNumber(stats.connectedAirports)}</span>
        </div>
      </div>
    </div>
  );
}
```

### 7. Create Selected Airport Marker Layer

```typescript
// src/components/FlightMap/layers/airportMarkerLayer.ts
import { IconLayer } from '@deck.gl/layers';
import type { Airport } from '../../../types/flight';

interface AirportMarkerLayerOptions {
  selectedAirport: Airport | null;
}

export function createAirportMarkerLayer({
  selectedAirport,
}: AirportMarkerLayerOptions) {
  if (!selectedAirport) {
    return null;
  }

  return new IconLayer<Airport>({
    id: 'selected-airport-marker',
    data: [selectedAirport],
    pickable: false,

    // Position
    getPosition: (d) => [d.longitude, d.latitude],

    // Icon configuration
    iconAtlas: '/assets/airport-icon.png',
    iconMapping: {
      marker: { x: 0, y: 0, width: 64, height: 64, anchorY: 64 },
    },
    getIcon: () => 'marker',

    // Size
    sizeScale: 1,
    getSize: 48,
    sizeMinPixels: 32,
    sizeMaxPixels: 64,

    // Ensure marker is on top
    parameters: {
      depthTest: false,
    },
  });
}

// Alternative: Simple circle marker without icon
export function createSimpleAirportMarkerLayer({
  selectedAirport,
}: AirportMarkerLayerOptions) {
  if (!selectedAirport) {
    return null;
  }

  // Using ScatterplotLayer as alternative
  const { ScatterplotLayer } = require('@deck.gl/layers');

  return new ScatterplotLayer<Airport>({
    id: 'selected-airport-marker',
    data: [selectedAirport],
    pickable: false,

    getPosition: (d) => [d.longitude, d.latitude],
    getRadius: 50000, // 50km radius
    getFillColor: [0, 255, 255, 100], // Cyan with transparency
    getLineColor: [0, 255, 255, 255], // Solid cyan border
    stroked: true,
    lineWidthMinPixels: 3,

    // Pulsing effect via transitions
    transitions: {
      getRadius: {
        duration: 1000,
        easing: (t: number) => Math.sin(t * Math.PI),
      },
    },
  });
}
```

### 8. Integrate Filters with Main Component

```typescript
// src/components/FlightMap/FlightMap.tsx
import { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useFlightMapViewStore } from '../../stores/flightMapViewStore';
import { useFlightRoutesStore } from '../../stores/flightRoutesStore';
import { useFlightTooltip } from './hooks/useFlightTooltip';
import { useFilteredRoutes } from './hooks/useFilteredRoutes';
import { createFlightRoutesLayer } from './layers/flightRoutesLayer';
import { createSimpleAirportMarkerLayer } from './layers/airportMarkerLayer';
import { FlightTooltip } from './Tooltip/FlightTooltip';
import { ZoomControls } from './ZoomControls';
import { ArcLegend } from './Legend/ArcLegend';
import { AirportSelector } from './Filters/AirportSelector';
import { FilterModeSelector } from './Filters/FilterModeSelector';
import { FlightFilterStats } from './Filters/FlightFilterStats';
import type { FlightRoute } from '../../types/flight';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

interface FlightMapProps {
  routes: FlightRoute[];
}

export function FlightMap({ routes }: FlightMapProps) {
  const viewState = useFlightMapViewStore((state) => state.viewState);
  const setViewState = useFlightMapViewStore((state) => state.setViewState);
  const airports = useFlightRoutesStore((state) => state.airports);

  const { tooltip, hoveredRouteId, handleHover } = useFlightTooltip();
  const { filteredRoutes, stats, isFiltered, selectedAirportData } =
    useFilteredRoutes(routes);

  // Convert airports Map to array
  const airportsArray = useMemo(
    () => Array.from(airports.values()),
    [airports]
  );

  const layers = useMemo(() => {
    const layerList = [
      createFlightRoutesLayer({
        data: filteredRoutes,
        highlightedRouteId: hoveredRouteId,
        onHover: handleHover,
      }),
    ];

    // Add airport marker if filtered
    const markerLayer = createSimpleAirportMarkerLayer({
      selectedAirport: selectedAirportData,
    });
    if (markerLayer) {
      layerList.push(markerLayer);
    }

    return layerList;
  }, [filteredRoutes, hoveredRouteId, handleHover, selectedAirportData]);

  return (
    <div className="relative w-full h-full">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>

      {/* Filter Controls */}
      <div className="absolute top-4 left-4 space-y-3">
        <AirportSelector airports={airportsArray} />
        <FilterModeSelector />
        <FlightFilterStats
          stats={stats}
          selectedAirport={selectedAirportData}
          isFiltered={isFiltered}
        />
      </div>

      {/* Tooltip */}
      {tooltip.route && (
        <FlightTooltip
          route={tooltip.route}
          x={tooltip.x}
          y={tooltip.y}
        />
      )}

      <ZoomControls />
      <ArcLegend />
    </div>
  );
}
```

## Performance Considerations

### Efficient Filtering

Use memoization to avoid re-filtering on every render:

```typescript
const filteredRoutes = useMemo(() => {
  if (!selectedAirport) return routes;
  return routes.filter((route) => /* filter logic */);
}, [routes, selectedAirport, filterMode]);
```

### Search Index Optimization

Create Fuse.js index once and reuse:

```typescript
const fuse = useMemo(() => new Fuse(airports, fuseOptions), [airports]);
```

### Smooth Transitions

Use deck.gl transitions for filter changes:

```typescript
flyTo({
  ...targetPosition,
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
});
```

### Debounce Search Input

```typescript
const debouncedSetQuery = useMemo(
  () => debounce(setSearchQuery, 150),
  [setSearchQuery]
);
```

## Responsiveness

### Collapsible Filter Panel on Mobile

```typescript
// src/components/FlightMap/Filters/FilterPanel.tsx
export function FilterPanel({ airports }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-gray-800 text-white py-3 flex items-center justify-center gap-2"
        >
          <span>Filter Routes</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="bg-gray-900 p-4 space-y-3">
            <AirportSelector airports={airports} />
            <FilterModeSelector />
          </div>
        )}
      </div>
    );
  }

  // Desktop layout
  return (/* ... */);
}
```

### Touch-Friendly Dropdown

```typescript
// Larger touch targets for airport list items
<button className="min-h-[48px] px-4 py-3 ...">
  {/* Airport info */}
</button>
```

## Testing

### Unit Tests

```typescript
// src/stores/flightFilterStore.test.ts
- Test initial state is null for selectedAirport
- Test initial filterMode is 'both'
- Test setSelectedAirport updates state
- Test setFilterMode updates state
- Test clearFilter resets selectedAirport
- Test reset returns to initial state

// src/components/FlightMap/hooks/useFilteredRoutes.test.ts
- Test returns all routes when no airport selected
- Test filters routes by origin when filterMode is 'origin'
- Test filters routes by destination when filterMode is 'destination'
- Test filters routes by both when filterMode is 'both'
- Test stats are calculated correctly
- Test selectedAirportData returns correct airport

// src/components/FlightMap/hooks/useAirportSearch.test.ts
- Test returns default airports when query is empty
- Test returns matching airports for IATA code search
- Test returns matching airports for city name search
- Test returns matching airports for airport name search
- Test fuzzy matching works for typos
- Test clearSearch resets query

// src/components/FlightMap/Filters/AirportSelector.test.tsx
- Test renders search input
- Test dropdown opens on focus
- Test dropdown shows search results
- Test selecting airport updates store
- Test selecting airport triggers flyTo
- Test clear button clears filter
- Test "All Airports" option clears filter

// src/components/FlightMap/Filters/FilterModeSelector.test.tsx
- Test renders only when airport is selected
- Test renders all three mode buttons
- Test clicking mode button updates store
- Test selected mode has active styling
```

### Acceptance Tests

```gherkin
Feature: Filter by Airport
  Scenario: Search for an airport
    Given I am on the flight routes page
    When I click on the airport search field
    And I type "LAX"
    Then I should see Los Angeles airport in the results
    When I select Los Angeles International Airport
    Then only routes connected to LAX should be visible
    And the map should center on Los Angeles

  Scenario: Filter by departures only
    Given I have selected "JFK" as the airport filter
    When I click "Departures" filter mode
    Then only routes originating from JFK should be visible
    And routes arriving at JFK should be hidden

  Scenario: Filter by arrivals only
    Given I have selected "ORD" as the airport filter
    When I click "Arrivals" filter mode
    Then only routes arriving at ORD should be visible
    And routes departing from ORD should be hidden

  Scenario: View all routes
    Given I have filtered routes by airport "SFO"
    When I click "All Airports" option
    Then all flight routes should be visible
    And the map should reset to the default view

  Scenario: Stats update on filter
    Given I am on the flight routes page
    When I select "ATL" from the airport selector
    Then the stats should show routes connected to ATL
    And the weekly flights count should update
    And the connected airports count should update

  Scenario: Airport marker appears
    Given I am on the flight routes page
    When I select "DEN" from the airport selector
    Then a marker should appear at Denver airport
    And the marker should be visually distinct
```
