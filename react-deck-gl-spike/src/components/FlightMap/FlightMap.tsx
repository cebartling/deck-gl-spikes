import { useMemo, useCallback } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createFlightRoutesLayer } from './layers/flightRoutesLayer';
import { ArcLegend } from './Legend/ArcLegend';
import { ZoomControls } from './ZoomControls';
import { FlightTooltip } from './Tooltip/FlightTooltip';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useFlightTooltip } from './hooks/useFlightTooltip';
import { useFlightMapViewStore, type TransitionViewState } from '../../stores';
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

  // Enable keyboard navigation
  useKeyboardNavigation();

  // Tooltip state management
  const { tooltip, hoveredRouteId, handleHover } = useFlightTooltip();

  const layers = useMemo(
    () => [
      createFlightRoutesLayer({
        data: routes,
        highlightedRouteId: hoveredRouteId,
        onHover: handleHover,
      }),
    ],
    [routes, hoveredRouteId, handleHover]
  );

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

      {/* Flight Route Tooltip */}
      {tooltip.route && (
        <FlightTooltip route={tooltip.route} x={tooltip.x} y={tooltip.y} />
      )}

      <ZoomControls />
      <ArcLegend />
    </div>
  );
}
