import { useCallback } from 'react';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';
import { ELECTION_TYPES } from '../../../types/electionType';
import type { ElectionType } from '../../../types/electionType';

export function ElectionTypeSelector() {
  const electionType = useCountyFilterStore((state) => state.electionType);
  const setElectionType = useCountyFilterStore(
    (state) => state.setElectionType
  );

  const handleTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const type = event.target.value as ElectionType;
      setElectionType(type);
    },
    [setElectionType]
  );

  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/10">
      <label
        htmlFor="election-type-selector"
        className="block text-xs font-medium text-gray-400 mb-1.5"
      >
        Election Type
      </label>

      <select
        id="election-type-selector"
        value={electionType}
        onChange={handleTypeChange}
        className="w-full bg-gray-800 text-white border border-gray-600 rounded-md
                   px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {ELECTION_TYPES.map((info) => (
          <option key={info.type} value={info.type}>
            {info.label} - {info.description}
          </option>
        ))}
      </select>
    </div>
  );
}
