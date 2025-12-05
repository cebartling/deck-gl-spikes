import { useMemo, useCallback, useState } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import type { MapViewState } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';

import { createCountyLayer } from './layers/countyLayer';
import { VotingLegend } from './Legend';
import { CountyTooltip } from './Tooltip';
import { useTooltip } from './hooks/useTooltip';
import { useCountyVotingData } from '../../hooks/useCountyVotingData';

// Dark map style for better contrast with colored polygons
const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Initial view centered on continental US
const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

export function CountyVotingMap() {
  // Fetch county voting data
  const { data, loading, error } = useCountyVotingData();

  // View state
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

  // Tooltip state
  const { tooltip, onHover, clearTooltip, hoveredFips } = useTooltip();

  // Create layers with memoization
  const layers = useMemo(() => {
    if (!data) return [];
    return [
      createCountyLayer({
        data,
        highlightedFips: hoveredFips,
        onHover: (info) => {
          if (info.object) {
            onHover({
              object: info.object,
              x: info.x,
              y: info.y,
              picked: true,
            } as never);
          } else {
            clearTooltip();
          }
        },
      }),
    ];
  }, [data, hoveredFips, onHover, clearTooltip]);

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
    [clearTooltip]
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
        onViewStateChange={handleViewStateChange}
        controller={true}
        layers={layers}
        getTooltip={null}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>
      <CountyTooltip
        county={tooltip?.object?.properties ?? null}
        x={tooltip?.x ?? 0}
        y={tooltip?.y ?? 0}
        visible={tooltip !== null}
      />
      {!loading && !error && data && <VotingLegend />}
    </div>
  );
}
