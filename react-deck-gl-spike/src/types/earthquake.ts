export interface Earthquake {
  id: string;
  longitude: number;
  latitude: number;
  depth: number; // km
  magnitude: number; // Richter scale
  timestamp: string; // ISO 8601
  location: string; // Human-readable location
}

export interface GeoJSONFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
  properties: {
    mag: number;
    time: string;
    place: string;
  };
}

export interface GeoJSONResponse {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
