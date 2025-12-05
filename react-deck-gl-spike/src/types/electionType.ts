export type ElectionType = 'presidential' | 'midterm';

export interface ElectionTypeInfo {
  type: ElectionType;
  label: string;
  description: string;
}

export const ELECTION_TYPES: ElectionTypeInfo[] = [
  { type: 'presidential', label: 'Presidential', description: 'Every 4 years' },
  { type: 'midterm', label: 'Midterm', description: 'House & Senate' },
];
