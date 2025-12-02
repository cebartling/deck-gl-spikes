import { useEffect, useMemo, useCallback } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import type { MapViewState } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createEarthquakeLayer } from './layers/earthquakeLayer';
import { SizeLegend, ColorLegend } from './Legend';
import { ZoomControls } from './ZoomControls';
import { EarthquakeTooltip } from './Tooltip';
import { DateRangeSelector } from './Filters';
import { EarthquakeStats } from './Stats';
import { useTooltip } from './hooks/useTooltip';
import { useFilterState } from './hooks/useFilterState';
import { useFilteredEarthquakes } from './hooks/useFilteredEarthquakes';
import { useEarthquakeStore, useMapViewStore } from '../../stores';
import {
  constrainViewState,
  ZOOM_BOUNDS,
} from '../../utils/constrainViewState';

// Free OpenStreetMap-based style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// USGS Earthquake API - All earthquakes in the past 30 days
const EARTHQUAKE_DATA_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

export function EarthquakeMap() {
  // Earthquake store
  const earthquakes = useEarthquakeStore((state) => state.earthquakes);
  const loading = useEarthquakeStore((state) => state.loading);
  const error = useEarthquakeStore((state) => state.error);
  const fetchEarthquakes = useEarthquakeStore((state) => state.fetchEarthquakes);

  // Map view store
  const viewState = useMapViewStore((state) => state.viewState);
  const setViewState = useMapViewStore((state) => state.setViewState);
  const resetView = useMapViewStore((state) => state.reset);

  // Tooltip state
  const { tooltip, onHover, clearTooltip } = useTooltip();

  // Filter state
  const { filters, setDateRange } = useFilterState();

  // Apply filters to get displayed earthquakes
  const filteredEarthquakes = useFilteredEarthquakes(earthquakes, filters);

  // Check if any filter is active
  const isFiltered =
    filters.dateRange.startDate !== null || filters.dateRange.endDate !== null;

  // Fetch earthquake data on mount
  useEffect(() => {
    fetchEarthquakes(EARTHQUAKE_DATA_URL);
  }, [fetchEarthquakes]);

  // Compute date bounds from data
  const dateBounds = useMemo(() => {
    if (earthquakes.length === 0) return { min: undefined, max: undefined };

    const timestamps = earthquakes.map((eq) => new Date(eq.timestamp).getTime());
    return {
      min: new Date(Math.min(...timestamps)),
      max: new Date(Math.max(...timestamps)),
    };
  }, [earthquakes]);

  const layers = useMemo(
    () => [createEarthquakeLayer(filteredEarthquakes)],
    [filteredEarthquakes]
  );

  const handleViewStateChange = useCallback(
    (params: {
      viewState: MapViewState;
      interactionState?: { isDragging?: boolean; isZooming?: boolean };
    }) => {
      setViewState(constrainViewState(params.viewState));

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

  const handleZoomIn = useCallback(() => {
    setViewState(
      constrainViewState({
        ...viewState,
        zoom: Math.min(viewState.zoom + 1, ZOOM_BOUNDS.maxZoom),
      })
    );
  }, [viewState, setViewState]);

  const handleZoomOut = useCallback(() => {
    setViewState(
      constrainViewState({
        ...viewState,
        zoom: Math.max(viewState.zoom - 1, ZOOM_BOUNDS.minZoom),
      })
    );
  }, [viewState, setViewState]);

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute top-4 left-4 z-10 bg-gray-900/80 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-white/10 text-gray-100">
          Loading earthquake data...
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
        controller={true}
        layers={layers}
        onHover={onHover}
        getTooltip={null}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>
      <EarthquakeTooltip
        earthquake={tooltip?.object ?? null}
        x={tooltip?.x ?? 0}
        y={tooltip?.y ?? 0}
        visible={tooltip !== null}
      />
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={resetView}
      />
      {!loading && !error && earthquakes.length > 0 && (
        <>
          <div className="absolute top-4 left-4 z-10">
            <DateRangeSelector
              value={filters.dateRange}
              onChange={setDateRange}
              minDate={dateBounds.min}
              maxDate={dateBounds.max}
            />
          </div>
          <div className="absolute bottom-4 left-4 z-10">
            <EarthquakeStats
              totalCount={earthquakes.length}
              filteredCount={filteredEarthquakes.length}
              isFiltered={isFiltered}
            />
          </div>
          <SizeLegend />
          <ColorLegend />
        </>
      )}
    </div>
  );
}
