import { useEffect, useMemo } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import type { MapViewState } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createEarthquakeLayer } from './layers/earthquakeLayer';
import { useEarthquakeStore, useMapViewStore } from '../../stores';

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

  // Fetch earthquake data on mount
  useEffect(() => {
    fetchEarthquakes(EARTHQUAKE_DATA_URL);
  }, [fetchEarthquakes]);

  const layers = useMemo(
    () => [createEarthquakeLayer(earthquakes)],
    [earthquakes]
  );

  const handleViewStateChange = (params: { viewState: MapViewState }) => {
    setViewState(params.viewState);
  };

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
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>
    </div>
  );
}
