import { ScatterplotLayer } from '@deck.gl/layers';
import type { Airport } from '../../../types/flight';

interface AirportMarkerLayerOptions {
  selectedAirport: Airport | null;
}

export function createAirportMarkerLayer({
  selectedAirport,
}: AirportMarkerLayerOptions) {
  if (!selectedAirport) {
    return null;
  }

  return new ScatterplotLayer<Airport>({
    id: 'selected-airport-marker',
    data: [selectedAirport],
    pickable: false,

    getPosition: (d) => [d.longitude, d.latitude],
    getRadius: 50000, // 50km radius
    getFillColor: [0, 255, 255, 100], // Cyan with transparency
    getLineColor: [0, 255, 255, 255], // Solid cyan border
    stroked: true,
    lineWidthMinPixels: 3,
  });
}
