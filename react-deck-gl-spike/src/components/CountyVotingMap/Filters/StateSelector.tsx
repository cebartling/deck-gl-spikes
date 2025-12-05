import { useCallback } from 'react';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';
import { useCountyVotingViewStore } from '../../../stores/countyVotingViewStore';
import { US_STATES, getStateCenterByFips } from '../../../types/states';

export function StateSelector() {
  const selectedState = useCountyFilterStore((state) => state.selectedState);
  const setSelectedState = useCountyFilterStore(
    (state) => state.setSelectedState
  );
  const flyTo = useCountyVotingViewStore((state) => state.flyTo);
  const resetView = useCountyVotingViewStore((state) => state.resetView);

  const handleStateChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const stateFips = event.target.value || null;
      setSelectedState(stateFips);

      // Fly to selected state or reset to national view
      if (stateFips) {
        const center = getStateCenterByFips(stateFips);
        if (center) {
          flyTo(center);
        }
      } else {
        resetView();
      }
    },
    [setSelectedState, flyTo, resetView]
  );

  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/10">
      <label
        htmlFor="state-selector"
        className="block text-xs font-medium text-gray-400 mb-1.5"
      >
        Filter by State
      </label>

      <select
        id="state-selector"
        value={selectedState || ''}
        onChange={handleStateChange}
        className="w-full bg-gray-800 text-white border border-gray-600 rounded-md
                   px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        <option value="">All States</option>
        {US_STATES.map((state) => (
          <option key={state.fips} value={state.fips}>
            {state.name}
          </option>
        ))}
      </select>
    </div>
  );
}
