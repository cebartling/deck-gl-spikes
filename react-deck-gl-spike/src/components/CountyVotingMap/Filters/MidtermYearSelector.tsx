import { useCallback } from 'react';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';
import { MIDTERM_YEARS, MIDTERM_YEAR_INFO } from '../../../types/midterm';
import type { MidtermYear } from '../../../types/midterm';

export function MidtermYearSelector() {
  const selectedYear = useCountyFilterStore(
    (state) => state.selectedMidtermYear
  );
  const setSelectedYear = useCountyFilterStore(
    (state) => state.setSelectedMidtermYear
  );

  const handleYearChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const year = parseInt(event.target.value, 10) as MidtermYear;
      setSelectedYear(year);
    },
    [setSelectedYear]
  );

  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/10">
      <label
        htmlFor="midterm-year-selector"
        className="block text-xs font-medium text-gray-400 mb-1.5"
      >
        Midterm Year
      </label>

      <select
        id="midterm-year-selector"
        value={selectedYear}
        onChange={handleYearChange}
        className="w-full bg-gray-800 text-white border border-gray-600 rounded-md
                   px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {MIDTERM_YEARS.map((year) => (
          <option key={year} value={year}>
            {MIDTERM_YEAR_INFO[year].label} -{' '}
            {MIDTERM_YEAR_INFO[year].description}
          </option>
        ))}
      </select>
    </div>
  );
}
