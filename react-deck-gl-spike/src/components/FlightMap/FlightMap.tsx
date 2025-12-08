import { useMemo, useCallback } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createFlightRoutesLayer } from './layers/flightRoutesLayer';
import { createAirportMarkerLayer } from './layers/airportMarkerLayer';
import { ArcLegend } from './Legend/ArcLegend';
import { ZoomControls } from './ZoomControls';
import { FlightTooltip } from './Tooltip/FlightTooltip';
import {
  AirportSelector,
  FilterModeSelector,
  FlightFilterStats,
} from './Filters';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useFlightTooltip } from './hooks/useFlightTooltip';
import { useFilteredRoutes } from './hooks/useFilteredRoutes';
import {
  useFlightMapViewStore,
  useFlightRoutesStore,
  type TransitionViewState,
} from '../../stores';
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
  const airports = useFlightRoutesStore((state) => state.airports);

  // Enable keyboard navigation
  useKeyboardNavigation();

  // Tooltip state management
  const { tooltip, hoveredRouteId, handleHover } = useFlightTooltip();

  // Filter state management
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
    const markerLayer = createAirportMarkerLayer({
      selectedAirport: selectedAirportData,
    });
    if (markerLayer) {
      layerList.push(markerLayer as never);
    }

    return layerList;
  }, [filteredRoutes, hoveredRouteId, handleHover, selectedAirportData]);

  const handleViewStateChange = useCallback(
    (params: { viewState: TransitionViewState }) => {
      // Apply zoom and pitch constraints
      const constrainedViewState: TransitionViewState = {
        ...params.viewState,
        zoom: Math.min(Math.max(params.viewState.zoom, MIN_ZOOM), MAX_ZOOM),
        pitch: Math.min(Math.max(params.viewState.pitch ?? 0, 0), 60),
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
        controller={{
          // Enable all standard interactions
          dragPan: true,
          dragRotate: true, // Right-click or Ctrl+drag to rotate
          scrollZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          touchRotate: true,
          keyboard: false, // We handle keyboard separately
        }}
        layers={layers}
        getCursor={({ isDragging, isHovering }) =>
          isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'
        }
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

      {/* Flight Route Tooltip */}
      {tooltip.route && (
        <FlightTooltip route={tooltip.route} x={tooltip.x} y={tooltip.y} />
      )}

      <ZoomControls />
      <ArcLegend />
    </div>
  );
}
