import { z } from 'zod';

// Zod schema for county voting data
export const CountyVotingSchema = z.object({
  fips: z.string(), // 5-digit FIPS code
  name: z.string(), // County name
  state: z.string(), // State abbreviation
  stateFips: z.string(), // 2-digit state FIPS
  totalVotes: z.number(),
  democratVotes: z.number(),
  republicanVotes: z.number(),
  otherVotes: z.number(),
  margin: z.number(), // Positive = Democrat, Negative = Republican
  marginPercent: z.number(), // -100 to +100
});

export type CountyVoting = z.infer<typeof CountyVotingSchema>;

// GeoJSON Feature with voting properties
export interface CountyFeature {
  type: 'Feature';
  properties: CountyVoting;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}

export interface CountyFeatureCollection {
  type: 'FeatureCollection';
  features: CountyFeature[];
}
