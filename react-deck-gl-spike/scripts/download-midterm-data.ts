import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MIDTERM_YEARS = [2010, 2014, 2018, 2022] as const;
type MidtermYear = (typeof MIDTERM_YEARS)[number];

interface MidtermCountyVoting {
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
  houseRaces?: number;
  senateRace?: boolean;
}

// States that had Senate races in each midterm year
const SENATE_RACE_STATES: Record<MidtermYear, string[]> = {
  2022: [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'MD',
    'MO',
    'NV',
    'NH',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'SC',
    'SD',
    'UT',
    'VT',
    'WA',
    'WI',
  ],
  2018: [
    'AZ',
    'CA',
    'CT',
    'DE',
    'FL',
    'HI',
    'IN',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NJ',
    'NM',
    'NY',
    'ND',
    'OH',
    'PA',
    'RI',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ],
  2014: [
    'AL',
    'AK',
    'AR',
    'CO',
    'DE',
    'GA',
    'HI',
    'ID',
    'IL',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MA',
    'MI',
    'MN',
    'MS',
    'MT',
    'NE',
    'NH',
    'NJ',
    'NM',
    'NC',
    'OK',
    'OR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'VA',
    'WV',
    'WY',
  ],
  2010: [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'MD',
    'MO',
    'NV',
    'NH',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'SC',
    'SD',
    'UT',
    'VT',
    'WA',
    'WI',
  ],
};

// Approximate national swing factors for each midterm (positive = Dem-favorable)
const MIDTERM_SWING: Record<MidtermYear, number> = {
  2022: 0.02, // Slight Dem lean (abortion issue)
  2018: 0.08, // Blue wave
  2014: -0.06, // Red wave
  2010: -0.07, // Tea Party wave
};

/**
 * Load presidential election data as base for midterm data
 * Uses the closest presidential year as reference
 */
function loadPresidentialBase(midtermYear: MidtermYear): MidtermCountyVoting[] {
  // Map midterm year to closest presidential year
  const presidentialYear: Record<MidtermYear, number> = {
    2022: 2020,
    2018: 2016,
    2014: 2012,
    2010: 2008,
  };

  const baseYear = presidentialYear[midtermYear];
  const dataPath = join(
    __dirname,
    '..',
    'public',
    'data',
    'elections',
    `${baseYear}.json`
  );

  if (!existsSync(dataPath)) {
    throw new Error(
      `Presidential data for ${baseYear} not found. Run 'npm run data:download' first.`
    );
  }

  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
  return data;
}

/**
 * Transform presidential data to midterm format
 * Applies swing adjustments and adds midterm-specific fields
 */
function transformToMidterm(
  baseData: MidtermCountyVoting[],
  year: MidtermYear
): MidtermCountyVoting[] {
  const swing = MIDTERM_SWING[year];
  const senateStates = SENATE_RACE_STATES[year];

  // Midterm elections typically have lower turnout
  const turnoutReduction = 0.65; // ~65% of presidential turnout

  return baseData.map((county) => {
    // Apply turnout reduction
    const totalVotes = Math.round(county.totalVotes * turnoutReduction);

    // Apply swing (shift vote share)
    const baseVoteShare = county.democratVotes / county.totalVotes;
    const adjustedVoteShare = Math.max(0, Math.min(1, baseVoteShare + swing));

    // Add some random variation to make data more realistic
    const randomVariation = (Math.random() - 0.5) * 0.04;
    const finalVoteShare = Math.max(
      0.1,
      Math.min(0.9, adjustedVoteShare + randomVariation)
    );

    const democratVotes = Math.round(totalVotes * finalVoteShare);
    const republicanVotes = Math.round(
      totalVotes * (1 - finalVoteShare) * 0.98
    );
    const otherVotes = Math.max(0, totalVotes - democratVotes - republicanVotes);
    const margin = democratVotes - republicanVotes;
    const marginPercent = totalVotes > 0 ? (margin / totalVotes) * 100 : 0;

    return {
      fips: county.fips,
      name: county.name,
      state: county.state,
      stateFips: county.stateFips,
      totalVotes,
      democratVotes,
      republicanVotes,
      otherVotes,
      margin,
      marginPercent: Math.round(marginPercent * 100) / 100,
      houseRaces: 1, // Simplified: assume 1 House race per county
      senateRace: senateStates.includes(county.state),
    };
  });
}

function saveData(year: MidtermYear, data: MidtermCountyVoting[]): void {
  const outputDir = join(
    __dirname,
    '..',
    'public',
    'data',
    'elections',
    'midterm'
  );
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, `${year}.json`);
  writeFileSync(outputPath, JSON.stringify(data));
  console.log(`  Saved ${data.length} counties to midterm/${year}.json`);
}

async function downloadMidtermYear(year: MidtermYear): Promise<void> {
  console.log(`Processing ${year} midterm data...`);

  try {
    // Load presidential base data
    const baseData = loadPresidentialBase(year);

    // Transform to midterm format
    const midtermData = transformToMidterm(baseData, year);

    // Save to file
    saveData(year, midtermData);
  } catch (error) {
    console.error(`  Error processing ${year}:`, error);
    throw error;
  }
}

async function main() {
  console.log('Generating midterm election data...\n');
  console.log(
    'Note: This script generates simulated midterm data based on\n' +
      'presidential election results with historical swing adjustments.\n' +
      'For actual midterm data, replace with MIT Election Lab data.\n'
  );

  try {
    for (const year of MIDTERM_YEARS) {
      await downloadMidtermYear(year);
    }

    console.log('\nAll midterm data generated successfully!');
  } catch (error) {
    console.error('Failed to generate midterm data:', error);
    process.exit(1);
  }
}

main();
