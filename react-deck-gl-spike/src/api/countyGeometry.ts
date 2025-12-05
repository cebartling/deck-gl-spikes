import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

// Data source URL
const TOPOJSON_URL =
  'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

interface CountyProperties {
  name: string;
}

type CountiesTopology = Topology<{
  counties: GeometryCollection<CountyProperties>;
}>;

/**
 * Fetch county TopoJSON and convert to GeoJSON
 */
export async function fetchCountyGeometry(): Promise<
  FeatureCollection<Polygon | MultiPolygon, CountyProperties>
> {
  const response = await fetch(TOPOJSON_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch TopoJSON: ${response.statusText}`);
  }

  const topology = (await response.json()) as CountiesTopology;
  const geojson = topojson.feature(
    topology,
    topology.objects.counties
  ) as FeatureCollection<Polygon | MultiPolygon, CountyProperties>;

  return geojson;
}
