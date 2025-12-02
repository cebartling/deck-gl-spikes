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
import { useTooltip } from './hooks/useTooltip';
import { useFilterState } from './hooks/useFilterState';
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

  // Filter earthquakes by date range
  const filteredEarthquakes = useMemo(() => {
    const { startDate, endDate } = filters.dateRange;
    if (!startDate && !endDate) return earthquakes;

    return earthquakes.filter((eq) => {
      const eqDate = new Date(eq.timestamp);
      if (startDate && eqDate < startDate) return false;
      if (endDate && eqDate > endDate) return false;
      return true;
    });
  }, [earthquakes, filters.dateRange]);

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
        <div className="absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded shadow">
          Loading earthquake data...
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 z-10 bg-red-100 text-red-700 px-3 py-2 rounded shadow">
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
          <SizeLegend />
          <ColorLegend />
        </>
      )}
    </div>
  );
}
