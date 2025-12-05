import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type {
  Feature,
  Polygon,
  MultiPolygon,
  FeatureCollection,
} from 'geojson';
import type { CountyFeatureCollection, CountyVoting } from '../types/county';

// Data source URLs
const TOPOJSON_URL =
  'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';
const ELECTION_CSV_URL =
  'https://raw.githubusercontent.com/tonmcg/US_County_Level_Election_Results_08-24/master/2024_US_County_Level_Presidential_Results.csv';

// State FIPS to abbreviation mapping
const STATE_FIPS_TO_ABBR: Record<string, string> = {
  '01': 'AL',
  '02': 'AK',
  '04': 'AZ',
  '05': 'AR',
  '06': 'CA',
  '08': 'CO',
  '09': 'CT',
  '10': 'DE',
  '11': 'DC',
  '12': 'FL',
  '13': 'GA',
  '15': 'HI',
  '16': 'ID',
  '17': 'IL',
  '18': 'IN',
  '19': 'IA',
  '20': 'KS',
  '21': 'KY',
  '22': 'LA',
  '23': 'ME',
  '24': 'MD',
  '25': 'MA',
  '26': 'MI',
  '27': 'MN',
  '28': 'MS',
  '29': 'MO',
  '30': 'MT',
  '31': 'NE',
  '32': 'NV',
  '33': 'NH',
  '34': 'NJ',
  '35': 'NM',
  '36': 'NY',
  '37': 'NC',
  '38': 'ND',
  '39': 'OH',
  '40': 'OK',
  '41': 'OR',
  '42': 'PA',
  '44': 'RI',
  '45': 'SC',
  '46': 'SD',
  '47': 'TN',
  '48': 'TX',
  '49': 'UT',
  '50': 'VT',
  '51': 'VA',
  '53': 'WA',
  '54': 'WV',
  '55': 'WI',
  '56': 'WY',
  '72': 'PR',
};

interface ElectionCsvRow {
  state_name: string;
  county_fips: string;
  county_name: string;
  votes_gop: string;
  votes_dem: string;
  total_votes: string;
  diff: string;
  per_gop: string;
  per_dem: string;
  per_point_diff: string;
}

interface CountyProperties {
  name: string;
}

type CountiesTopology = Topology<{
  counties: GeometryCollection<CountyProperties>;
}>;

/**
 * Parse CSV text into an array of objects
 */
function parseCsv(csvText: string): ElectionCsvRow[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    return row as unknown as ElectionCsvRow;
  });
}

/**
 * Fetch county TopoJSON and convert to GeoJSON
 */
async function fetchCountyGeometry(): Promise<
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

/**
 * Fetch 2024 election results CSV
 */
async function fetchElectionResults(): Promise<Map<string, ElectionCsvRow>> {
  const response = await fetch(ELECTION_CSV_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch election data: ${response.statusText}`);
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);

  // Create a map by FIPS code for quick lookup
  const electionMap = new Map<string, ElectionCsvRow>();
  for (const row of rows) {
    // Pad FIPS to 5 digits if needed
    const fips = row.county_fips.padStart(5, '0');
    electionMap.set(fips, row);
  }

  return electionMap;
}

/**
 * Fetch and merge county geometry with election results
 */
export async function fetchCountyVotingData(): Promise<CountyFeatureCollection> {
  // Fetch both datasets in parallel
  const [geojson, electionMap] = await Promise.all([
    fetchCountyGeometry(),
    fetchElectionResults(),
  ]);

  // Merge geometry with election data
  const features = geojson.features
    .map((feature) => {
      const fips = (feature as Feature).id?.toString().padStart(5, '0') || '';
      const election = electionMap.get(fips);

      if (!election) {
        // Skip counties without election data
        return null;
      }

      const stateFips = fips.slice(0, 2);
      const gopVotes = parseInt(election.votes_gop, 10) || 0;
      const demVotes = parseInt(election.votes_dem, 10) || 0;
      const totalVotes = parseInt(election.total_votes, 10) || 0;
      const otherVotes = Math.max(0, totalVotes - gopVotes - demVotes);

      // Calculate margin (positive = Democrat lead, negative = Republican lead)
      const margin = demVotes - gopVotes;
      // per_point_diff is GOP - DEM percentage, so we negate it
      const marginPercent = -(parseFloat(election.per_point_diff) || 0) * 100;

      const properties: CountyVoting = {
        fips,
        name: election.county_name || feature.properties?.name || 'Unknown',
        state: STATE_FIPS_TO_ABBR[stateFips] || stateFips,
        stateFips,
        totalVotes,
        democratVotes: demVotes,
        republicanVotes: gopVotes,
        otherVotes,
        margin,
        marginPercent,
      };

      return {
        type: 'Feature' as const,
        properties,
        geometry: feature.geometry,
      };
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);

  return {
    type: 'FeatureCollection',
    features,
  };
}
