import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const DATA_SOURCE_BASE =
  'https://raw.githubusercontent.com/tonmcg/US_County_Level_Election_Results_08-24/master';

// Combined file contains 2008, 2012, 2016 data
const COMBINED_FILE_URL = `${DATA_SOURCE_BASE}/US_County_Level_Presidential_Results_08-16.csv`;

// Individual files for 2020, 2024
const INDIVIDUAL_FILES: Record<number, string> = {
  2020: `${DATA_SOURCE_BASE}/2020_US_County_Level_Presidential_Results.csv`,
  2024: `${DATA_SOURCE_BASE}/2024_US_County_Level_Presidential_Results.csv`,
};

interface CountyVoting {
  fips: string;
  name: string;
  state: string;
  stateFips: string;
  totalVotes: number;
  democratVotes: number;
  republicanVotes: number;
  otherVotes: number;
  margin: number;
  marginPercent: number;
}

function parseCsv(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    return row;
  });
}

/**
 * Transform individual year file (2020, 2024 format)
 */
function transformIndividualFile(
  rows: Record<string, string>[]
): CountyVoting[] {
  return rows
    .map((row) => {
      const fips = row.county_fips.padStart(5, '0');
      const stateFips = fips.slice(0, 2);
      const gopVotes = parseInt(row.votes_gop, 10) || 0;
      const demVotes = parseInt(row.votes_dem, 10) || 0;
      const totalVotes = parseInt(row.total_votes, 10) || 0;

      // Skip invalid entries
      if (!fips || fips === '00000' || totalVotes === 0) {
        return null;
      }

      return {
        fips,
        name: row.county_name,
        state: STATE_FIPS_TO_ABBR[stateFips] || stateFips,
        stateFips,
        totalVotes,
        democratVotes: demVotes,
        republicanVotes: gopVotes,
        otherVotes: Math.max(0, totalVotes - gopVotes - demVotes),
        margin: demVotes - gopVotes,
        marginPercent: -(parseFloat(row.per_point_diff) || 0) * 100,
      };
    })
    .filter((item): item is CountyVoting => item !== null);
}

/**
 * Transform combined file (2008, 2012, 2016 format) for a specific year
 */
function transformCombinedFile(
  rows: Record<string, string>[],
  year: number
): CountyVoting[] {
  return rows
    .map((row) => {
      const fips = row.fips_code.padStart(5, '0');
      const stateFips = fips.slice(0, 2);
      const gopVotes = parseInt(row[`gop_${year}`], 10) || 0;
      const demVotes = parseInt(row[`dem_${year}`], 10) || 0;
      const totalVotes = parseInt(row[`total_${year}`], 10) || 0;
      const otherVotes = parseInt(row[`oth_${year}`], 10) || 0;

      // Skip invalid entries
      if (!fips || fips === '00000' || totalVotes === 0) {
        return null;
      }

      // Calculate margin percentage
      const margin = demVotes - gopVotes;
      const marginPercent = totalVotes > 0 ? (margin / totalVotes) * 100 : 0;

      return {
        fips,
        name: row.county,
        state: STATE_FIPS_TO_ABBR[stateFips] || stateFips,
        stateFips,
        totalVotes,
        democratVotes: demVotes,
        republicanVotes: gopVotes,
        otherVotes,
        margin,
        marginPercent,
      };
    })
    .filter((item): item is CountyVoting => item !== null);
}

function saveData(year: number, data: CountyVoting[]): void {
  const outputDir = join(__dirname, '..', 'public', 'data', 'elections');
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, `${year}.json`);
  writeFileSync(outputPath, JSON.stringify(data));
  console.log(`  Saved ${data.length} counties to ${year}.json`);
}

async function fetchCsv(url: string): Promise<Record<string, string>[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  const csv = await response.text();
  return parseCsv(csv);
}

async function downloadCombinedYears(): Promise<void> {
  console.log('Downloading combined election data (2008, 2012, 2016)...');
  const rows = await fetchCsv(COMBINED_FILE_URL);

  for (const year of [2008, 2012, 2016]) {
    console.log(`  Processing ${year}...`);
    const data = transformCombinedFile(rows, year);
    saveData(year, data);
  }
}

async function downloadIndividualYear(year: number): Promise<void> {
  const url = INDIVIDUAL_FILES[year];
  console.log(`Downloading ${year} election data...`);

  const rows = await fetchCsv(url);
  const data = transformIndividualFile(rows);
  saveData(year, data);
}

async function main() {
  console.log('Starting election data download...\n');

  try {
    // Download combined file for 2008, 2012, 2016
    await downloadCombinedYears();

    // Download individual files for 2020, 2024
    for (const year of [2020, 2024]) {
      await downloadIndividualYear(year);
    }

    console.log('\nAll election data downloaded successfully!');
  } catch (error) {
    console.error('Failed to download election data:', error);
    process.exit(1);
  }
}

main();
