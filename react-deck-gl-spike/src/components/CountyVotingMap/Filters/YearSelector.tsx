import { useCallback } from 'react';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';
import { ELECTION_YEARS, ELECTION_YEAR_INFO } from '../../../types/election';
import type { ElectionYear } from '../../../types/election';

export function YearSelector() {
  const selectedYear = useCountyFilterStore((state) => state.selectedYear);
  const setSelectedYear = useCountyFilterStore(
    (state) => state.setSelectedYear
  );

  const handleYearChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const year = parseInt(event.target.value, 10) as ElectionYear;
      setSelectedYear(year);
    },
    [setSelectedYear]
  );

  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/10">
      <label
        htmlFor="year-selector"
        className="block text-xs font-medium text-gray-400 mb-1.5"
      >
        Election Year
      </label>

      <select
        id="year-selector"
        value={selectedYear}
        onChange={handleYearChange}
        className="w-full bg-gray-800 text-white border border-gray-600 rounded-md
                   px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {ELECTION_YEARS.map((year) => (
          <option key={year} value={year}>
            {ELECTION_YEAR_INFO[year].label} -{' '}
            {ELECTION_YEAR_INFO[year].description}
          </option>
        ))}
      </select>
    </div>
  );
}
