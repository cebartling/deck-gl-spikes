export type ElectionYear = 2008 | 2012 | 2016 | 2020 | 2024;

export const ELECTION_YEARS: ElectionYear[] = [2024, 2020, 2016, 2012, 2008];

export interface ElectionYearInfo {
  year: ElectionYear;
  label: string;
  description: string;
}

export const ELECTION_YEAR_INFO: Record<ElectionYear, ElectionYearInfo> = {
  2024: { year: 2024, label: '2024', description: 'Harris vs Trump' },
  2020: { year: 2020, label: '2020', description: 'Biden vs Trump' },
  2016: { year: 2016, label: '2016', description: 'Clinton vs Trump' },
  2012: { year: 2012, label: '2012', description: 'Obama vs Romney' },
  2008: { year: 2008, label: '2008', description: 'Obama vs McCain' },
};
