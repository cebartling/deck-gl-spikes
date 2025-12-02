import { useMemo } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import type { MapViewState } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createEarthquakeLayer } from './layers/earthquakeLayer';
import { useEarthquakeData } from '../../hooks/useEarthquakeData';

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 0,
  latitude: 20,
  zoom: 1.5,
  pitch: 0,
  bearing: 0,
};

// Free OpenStreetMap-based style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// USGS Earthquake API - All earthquakes in the past 30 days
const EARTHQUAKE_DATA_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

export function EarthquakeMap() {
  const { data: earthquakes, loading, error } = useEarthquakeData(EARTHQUAKE_DATA_URL);

  const layers = useMemo(
    () => [createEarthquakeLayer(earthquakes)],
    [earthquakes]
  );

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
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>
    </div>
  );
}
