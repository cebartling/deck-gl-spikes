import { useMemo, useCallback } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import type { MapViewState } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';

import { createCountyLayer } from './layers/countyLayer';
import { VotingLegend } from './Legend';
import { CountyTooltip } from './Tooltip';
import { ZoomControls } from './ZoomControls';
import {
  StateSelector,
  FilterStats,
  YearSelector,
  ElectionTypeSelector,
  MidtermYearSelector,
} from './Filters';
import { useTooltip } from './hooks/useTooltip';
import { useFilteredCounties } from './hooks/useFilteredCounties';
import { useVotingData } from '../../hooks/useVotingData';
import { useCountyVotingViewStore } from '../../stores/countyVotingViewStore';
import { useCountyFilterStore } from '../../stores/countyFilterStore';
import { getStateNameByFips } from '../../types/states';

// Dark map style for better contrast with colored polygons
const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export function CountyVotingMap() {
  // Get election type and years from store
  const electionType = useCountyFilterStore((state) => state.electionType);
  const selectedPresidentialYear = useCountyFilterStore(
    (state) => state.selectedPresidentialYear
  );
  const selectedMidtermYear = useCountyFilterStore(
    (state) => state.selectedMidtermYear
  );

  // Fetch data conditionally based on election type
  const { data, loading, error, selectedYear } = useVotingData({
    electionType,
    presidentialYear: selectedPresidentialYear,
    midtermYear: selectedMidtermYear,
  });

  // View state from Zustand store
  const viewState = useCountyVotingViewStore((state) => state.viewState);
  const setViewState = useCountyVotingViewStore((state) => state.setViewState);

  // Filter state
  const selectedState = useCountyFilterStore((state) => state.selectedState);
  const { filteredData, stats, isFiltered } = useFilteredCounties(data);

  // Get selected state name for display
  const selectedStateName = useMemo(() => {
    if (!selectedState) return undefined;
    return getStateNameByFips(selectedState);
  }, [selectedState]);

  // Tooltip state
  const { tooltip, onHover, clearTooltip, hoveredFips } = useTooltip();

  // Create layers with memoization
  const layers = useMemo(() => {
    if (!filteredData) return [];
    return [
      createCountyLayer({
        data: filteredData,
        highlightedFips: hoveredFips,
        onHover,
      }),
    ];
  }, [filteredData, hoveredFips, onHover]);

  const handleViewStateChange = useCallback(
    (params: {
      viewState: MapViewState;
      interactionState?: { isDragging?: boolean; isZooming?: boolean };
    }) => {
      setViewState(params.viewState);

      // Dismiss tooltip during pan/zoom interactions
      if (
        params.interactionState?.isDragging ||
        params.interactionState?.isZooming
      ) {
        clearTooltip();
      }
    },
    [setViewState, clearTooltip]
  );

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute top-4 left-4 z-10 bg-gray-900/80 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-white/10 text-gray-100">
          Loading {selectedYear}{' '}
          {electionType === 'midterm' ? 'midterm' : 'election'} data...
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 z-10 bg-red-900/80 backdrop-blur-md text-red-200 px-3 py-2 rounded-lg shadow-lg border border-red-500/30">
          Error loading data: {error.message}
        </div>
      )}
      {/* TypeScript type cast: deck.gl's types for onViewStateChange may be incorrect */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange as never}
        controller={{
          dragPan: true,
          dragRotate: false, // Disable rotation for 2D choropleth map
          scrollZoom: true,
          touchZoom: true,
          touchRotate: false,
          doubleClickZoom: true,
          keyboard: true,
          inertia: true,
        }}
        layers={layers}
        getTooltip={null}
        getCursor={({ isDragging, isHovering }) =>
          isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'
        }
      >
        <Map mapStyle={MAP_STYLE} reuseMaps attributionControl={false} />
      </DeckGL>
      <CountyTooltip
        county={tooltip?.object?.properties ?? null}
        x={tooltip?.x ?? 0}
        y={tooltip?.y ?? 0}
        visible={tooltip !== null}
      />
      <ZoomControls />
      {/* Filter controls - shown when data is loaded */}
      {!loading && !error && data && (
        <div className="absolute top-4 left-4 z-10 space-y-2 w-48">
          <ElectionTypeSelector />
          {electionType === 'presidential' ? (
            <YearSelector />
          ) : (
            <MidtermYearSelector />
          )}
          <StateSelector />
          <FilterStats
            stats={stats}
            isFiltered={isFiltered}
            stateName={selectedStateName}
            electionType={electionType}
            year={selectedYear}
          />
        </div>
      )}
      {!loading && !error && data && <VotingLegend />}
    </div>
  );
}
