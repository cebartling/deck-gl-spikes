import { z } from 'zod';

export type MidtermYear = 2010 | 2014 | 2018 | 2022;

export const MIDTERM_YEARS: MidtermYear[] = [2022, 2018, 2014, 2010];

export interface MidtermYearInfo {
  year: MidtermYear;
  label: string;
  description: string;
}

export const MIDTERM_YEAR_INFO: Record<MidtermYear, MidtermYearInfo> = {
  2022: { year: 2022, label: '2022', description: 'House & Senate' },
  2018: { year: 2018, label: '2018', description: 'House & Senate' },
  2014: { year: 2014, label: '2014', description: 'House & Senate' },
  2010: { year: 2010, label: '2010', description: 'House & Senate' },
};

// Extended county voting schema for midterm data
export const MidtermCountyVotingSchema = z.object({
  fips: z.string(),
  name: z.string(),
  state: z.string(),
  stateFips: z.string(),
  totalVotes: z.number(),
  democratVotes: z.number(),
  republicanVotes: z.number(),
  otherVotes: z.number(),
  margin: z.number(),
  marginPercent: z.number(),
  houseRaces: z.number().optional(),
  senateRace: z.boolean().optional(),
});

export type MidtermCountyVoting = z.infer<typeof MidtermCountyVotingSchema>;

// Schema for validating cached midterm election data files
export const CachedMidtermDataSchema = z.array(MidtermCountyVotingSchema);

export type CachedMidtermData = z.infer<typeof CachedMidtermDataSchema>;
