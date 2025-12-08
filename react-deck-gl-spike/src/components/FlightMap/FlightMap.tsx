import { useMemo, useCallback, useState } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import type { MapViewState } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createFlightRoutesLayer } from './layers/flightRoutesLayer';
import { ArcLegend } from './Legend/ArcLegend';
import { useFlightMapViewStore } from '../../stores';
import type { FlightRoute } from '../../types/flight';

// Dark theme for better arc visibility
const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Zoom constraints
const MIN_ZOOM = 2;
const MAX_ZOOM = 12;

interface FlightMapProps {
  routes: FlightRoute[];
}

export function FlightMap({ routes }: FlightMapProps) {
  const viewState = useFlightMapViewStore((state) => state.viewState);
  const setViewState = useFlightMapViewStore((state) => state.setViewState);

  const [hoveredRoute, setHoveredRoute] = useState<FlightRoute | null>(null);

  const handleHover = useCallback(
    (info: { object?: FlightRoute; x: number; y: number }) => {
      setHoveredRoute(info.object ?? null);
    },
    []
  );

  const layers = useMemo(
    () => [
      createFlightRoutesLayer({
        data: routes,
        highlightedRouteId: hoveredRoute?.id ?? null,
        onHover: handleHover,
      }),
    ],
    [routes, hoveredRoute, handleHover]
  );

  const handleViewStateChange = useCallback(
    (params: { viewState: MapViewState }) => {
      // Apply zoom constraints
      const constrainedViewState = {
        ...params.viewState,
        zoom: Math.min(Math.max(params.viewState.zoom, MIN_ZOOM), MAX_ZOOM),
      };
      setViewState(constrainedViewState);
    },
    [setViewState]
  );

  return (
    <div className="w-full h-full relative">
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange as never}
        controller={true}
        layers={layers}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>
      <ArcLegend />
    </div>
  );
}
