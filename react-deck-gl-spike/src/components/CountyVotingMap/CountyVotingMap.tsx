import { useMemo, useCallback } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import type { MapViewState } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';

import { createCountyLayer } from './layers/countyLayer';
import { VotingLegend } from './Legend';
import { CountyTooltip } from './Tooltip';
import { ZoomControls } from './ZoomControls';
import { useTooltip } from './hooks/useTooltip';
import { useCountyVotingData } from '../../hooks/useCountyVotingData';
import {
  useCountyVotingViewStore,
  constrainToUSBounds,
} from '../../stores/countyVotingViewStore';

// Dark map style for better contrast with colored polygons
const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export function CountyVotingMap() {
  // Fetch county voting data
  const { data, loading, error } = useCountyVotingData();

  // View state from Zustand store
  const viewState = useCountyVotingViewStore((state) => state.viewState);
  const setViewState = useCountyVotingViewStore((state) => state.setViewState);

  // Tooltip state
  const { tooltip, onHover, clearTooltip, hoveredFips } = useTooltip();

  // Create layers with memoization
  const layers = useMemo(() => {
    if (!data) return [];
    return [
      createCountyLayer({
        data,
        highlightedFips: hoveredFips,
        onHover,
      }),
    ];
  }, [data, hoveredFips, onHover]);

  const handleViewStateChange = useCallback(
    (params: {
      viewState: MapViewState;
      interactionState?: { isDragging?: boolean; isZooming?: boolean };
    }) => {
      setViewState(constrainToUSBounds(params.viewState));

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
          Loading county voting data...
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 z-10 bg-red-900/80 backdrop-blur-md text-red-200 px-3 py-2 rounded-lg shadow-lg border border-red-500/30">
          Error loading data: {error.message}
        </div>
      )}
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
        getCursor={({ isDragging }) => (isDragging ? 'grabbing' : 'grab')}
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
      {!loading && !error && data && <VotingLegend />}
    </div>
  );
}
