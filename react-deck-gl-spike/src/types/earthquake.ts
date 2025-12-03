import { z } from 'zod';

// Zod schema for earthquake data
export const EarthquakeSchema = z.object({
  id: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  depth: z.number(), // km
  magnitude: z.number(), // Richter scale
  timestamp: z.string(), // ISO 8601
  location: z.string(), // Human-readable location
});

export type Earthquake = z.infer<typeof EarthquakeSchema>;

// Zod schema for GeoJSON feature from USGS API
export const GeoJSONFeatureSchema = z.object({
  id: z.string(),
  type: z.literal('Feature'),
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number(), z.number()]), // [longitude, latitude, depth]
  }),
  properties: z.object({
    mag: z.number().nullable(),
    time: z.number(),
    place: z.string().nullable(),
  }),
});

export type GeoJSONFeature = z.infer<typeof GeoJSONFeatureSchema>;

// Zod schema for GeoJSON response from USGS API
export const GeoJSONResponseSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(GeoJSONFeatureSchema),
});

export type GeoJSONResponse = z.infer<typeof GeoJSONResponseSchema>;
