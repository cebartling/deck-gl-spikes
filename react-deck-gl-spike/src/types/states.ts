/**
 * US State data with FIPS codes and geographic centers
 */

export interface USState {
  code: string; // 2-letter state code (e.g., 'CA')
  name: string; // Full state name (e.g., 'California')
  fips: string; // 2-digit FIPS code (e.g., '06')
}

/**
 * All 50 US states plus District of Columbia, sorted alphabetically
 */
export const US_STATES: USState[] = [
  { code: 'AL', name: 'Alabama', fips: '01' },
  { code: 'AK', name: 'Alaska', fips: '02' },
  { code: 'AZ', name: 'Arizona', fips: '04' },
  { code: 'AR', name: 'Arkansas', fips: '05' },
  { code: 'CA', name: 'California', fips: '06' },
  { code: 'CO', name: 'Colorado', fips: '08' },
  { code: 'CT', name: 'Connecticut', fips: '09' },
  { code: 'DE', name: 'Delaware', fips: '10' },
  { code: 'DC', name: 'District of Columbia', fips: '11' },
  { code: 'FL', name: 'Florida', fips: '12' },
  { code: 'GA', name: 'Georgia', fips: '13' },
  { code: 'HI', name: 'Hawaii', fips: '15' },
  { code: 'ID', name: 'Idaho', fips: '16' },
  { code: 'IL', name: 'Illinois', fips: '17' },
  { code: 'IN', name: 'Indiana', fips: '18' },
  { code: 'IA', name: 'Iowa', fips: '19' },
  { code: 'KS', name: 'Kansas', fips: '20' },
  { code: 'KY', name: 'Kentucky', fips: '21' },
  { code: 'LA', name: 'Louisiana', fips: '22' },
  { code: 'ME', name: 'Maine', fips: '23' },
  { code: 'MD', name: 'Maryland', fips: '24' },
  { code: 'MA', name: 'Massachusetts', fips: '25' },
  { code: 'MI', name: 'Michigan', fips: '26' },
  { code: 'MN', name: 'Minnesota', fips: '27' },
  { code: 'MS', name: 'Mississippi', fips: '28' },
  { code: 'MO', name: 'Missouri', fips: '29' },
  { code: 'MT', name: 'Montana', fips: '30' },
  { code: 'NE', name: 'Nebraska', fips: '31' },
  { code: 'NV', name: 'Nevada', fips: '32' },
  { code: 'NH', name: 'New Hampshire', fips: '33' },
  { code: 'NJ', name: 'New Jersey', fips: '34' },
  { code: 'NM', name: 'New Mexico', fips: '35' },
  { code: 'NY', name: 'New York', fips: '36' },
  { code: 'NC', name: 'North Carolina', fips: '37' },
  { code: 'ND', name: 'North Dakota', fips: '38' },
  { code: 'OH', name: 'Ohio', fips: '39' },
  { code: 'OK', name: 'Oklahoma', fips: '40' },
  { code: 'OR', name: 'Oregon', fips: '41' },
  { code: 'PA', name: 'Pennsylvania', fips: '42' },
  { code: 'RI', name: 'Rhode Island', fips: '44' },
  { code: 'SC', name: 'South Carolina', fips: '45' },
  { code: 'SD', name: 'South Dakota', fips: '46' },
  { code: 'TN', name: 'Tennessee', fips: '47' },
  { code: 'TX', name: 'Texas', fips: '48' },
  { code: 'UT', name: 'Utah', fips: '49' },
  { code: 'VT', name: 'Vermont', fips: '50' },
  { code: 'VA', name: 'Virginia', fips: '51' },
  { code: 'WA', name: 'Washington', fips: '53' },
  { code: 'WV', name: 'West Virginia', fips: '54' },
  { code: 'WI', name: 'Wisconsin', fips: '55' },
  { code: 'WY', name: 'Wyoming', fips: '56' },
];

/**
 * Geographic centers for each state, keyed by FIPS code.
 * Used for fly-to animations when filtering by state.
 */
export const STATE_CENTERS: Record<
  string,
  { longitude: number; latitude: number; zoom: number }
> = {
  '01': { longitude: -86.9023, latitude: 32.3182, zoom: 6 }, // Alabama
  '02': { longitude: -154.4931, latitude: 63.385, zoom: 4 }, // Alaska
  '04': { longitude: -111.0937, latitude: 34.0489, zoom: 6 }, // Arizona
  '05': { longitude: -91.8318, latitude: 35.201, zoom: 6 }, // Arkansas
  '06': { longitude: -119.4179, latitude: 36.7783, zoom: 5 }, // California
  '08': { longitude: -105.3111, latitude: 39.0598, zoom: 6 }, // Colorado
  '09': { longitude: -72.7554, latitude: 41.6032, zoom: 8 }, // Connecticut
  '10': { longitude: -75.5277, latitude: 38.9108, zoom: 8 }, // Delaware
  '11': { longitude: -77.0369, latitude: 38.9072, zoom: 11 }, // DC
  '12': { longitude: -81.5158, latitude: 27.6648, zoom: 6 }, // Florida
  '13': { longitude: -82.9001, latitude: 32.1656, zoom: 6 }, // Georgia
  '15': { longitude: -155.5828, latitude: 19.8968, zoom: 6 }, // Hawaii
  '16': { longitude: -114.4788, latitude: 44.0682, zoom: 5 }, // Idaho
  '17': { longitude: -89.3985, latitude: 40.6331, zoom: 6 }, // Illinois
  '18': { longitude: -86.1349, latitude: 40.2672, zoom: 6 }, // Indiana
  '19': { longitude: -93.0977, latitude: 41.878, zoom: 6 }, // Iowa
  '20': { longitude: -98.4842, latitude: 39.0119, zoom: 6 }, // Kansas
  '21': { longitude: -84.27, latitude: 37.8393, zoom: 6 }, // Kentucky
  '22': { longitude: -91.9623, latitude: 30.9843, zoom: 6 }, // Louisiana
  '23': { longitude: -69.4455, latitude: 45.2538, zoom: 6 }, // Maine
  '24': { longitude: -76.6413, latitude: 39.0458, zoom: 7 }, // Maryland
  '25': { longitude: -71.3824, latitude: 42.4072, zoom: 7 }, // Massachusetts
  '26': { longitude: -84.5555, latitude: 44.3148, zoom: 6 }, // Michigan
  '27': { longitude: -94.6859, latitude: 46.7296, zoom: 5 }, // Minnesota
  '28': { longitude: -89.3985, latitude: 32.3547, zoom: 6 }, // Mississippi
  '29': { longitude: -91.8318, latitude: 37.9643, zoom: 6 }, // Missouri
  '30': { longitude: -110.3626, latitude: 46.8797, zoom: 5 }, // Montana
  '31': { longitude: -99.9018, latitude: 41.4925, zoom: 6 }, // Nebraska
  '32': { longitude: -116.4194, latitude: 38.8026, zoom: 5 }, // Nevada
  '33': { longitude: -71.5724, latitude: 43.1939, zoom: 7 }, // New Hampshire
  '34': { longitude: -74.4057, latitude: 40.0583, zoom: 7 }, // New Jersey
  '35': { longitude: -105.8701, latitude: 34.5199, zoom: 6 }, // New Mexico
  '36': { longitude: -75.4999, latitude: 43.2994, zoom: 6 }, // New York
  '37': { longitude: -79.0193, latitude: 35.7596, zoom: 6 }, // North Carolina
  '38': { longitude: -101.002, latitude: 47.5515, zoom: 6 }, // North Dakota
  '39': { longitude: -82.9071, latitude: 40.4173, zoom: 6 }, // Ohio
  '40': { longitude: -97.0929, latitude: 35.0078, zoom: 6 }, // Oklahoma
  '41': { longitude: -120.5542, latitude: 43.8041, zoom: 6 }, // Oregon
  '42': { longitude: -77.1945, latitude: 41.2033, zoom: 6 }, // Pennsylvania
  '44': { longitude: -71.4774, latitude: 41.5801, zoom: 9 }, // Rhode Island
  '45': { longitude: -81.1637, latitude: 33.8361, zoom: 6 }, // South Carolina
  '46': { longitude: -99.9018, latitude: 43.9695, zoom: 6 }, // South Dakota
  '47': { longitude: -86.5804, latitude: 35.5175, zoom: 6 }, // Tennessee
  '48': { longitude: -99.9018, latitude: 31.9686, zoom: 5 }, // Texas
  '49': { longitude: -111.0937, latitude: 39.321, zoom: 6 }, // Utah
  '50': { longitude: -72.5778, latitude: 44.5588, zoom: 7 }, // Vermont
  '51': { longitude: -78.6569, latitude: 37.4316, zoom: 6 }, // Virginia
  '53': { longitude: -120.7401, latitude: 47.7511, zoom: 6 }, // Washington
  '54': { longitude: -80.4549, latitude: 38.5976, zoom: 7 }, // West Virginia
  '55': { longitude: -89.6165, latitude: 43.7844, zoom: 6 }, // Wisconsin
  '56': { longitude: -107.2903, latitude: 43.076, zoom: 6 }, // Wyoming
};

/**
 * Get state name by FIPS code
 */
export function getStateNameByFips(fips: string): string | undefined {
  return US_STATES.find((s) => s.fips === fips)?.name;
}

/**
 * Get state center coordinates by FIPS code
 */
export function getStateCenterByFips(
  fips: string
): { longitude: number; latitude: number; zoom: number } | undefined {
  return STATE_CENTERS[fips];
}
