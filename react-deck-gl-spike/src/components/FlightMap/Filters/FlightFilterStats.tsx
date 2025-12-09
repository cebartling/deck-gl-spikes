import type { FilteredRoutesStats } from '../../../types/flightFilter';
import type { Airport } from '../../../types/flight';

interface FlightFilterStatsProps {
  stats: FilteredRoutesStats;
  selectedAirport: Airport | null;
  isFiltered: boolean;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function FlightFilterStats({
  stats,
  selectedAirport,
  isFiltered,
}: FlightFilterStatsProps) {
  return (
    <div className="bg-gray-900/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/10">
      <h3 className="text-white font-medium mb-2">
        {isFiltered && selectedAirport
          ? `${selectedAirport.code} - ${selectedAirport.city}`
          : 'Network Summary'}
      </h3>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Routes</span>
          <span className="text-white">{formatNumber(stats.totalRoutes)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Weekly Flights</span>
          <span className="text-white">{formatNumber(stats.totalFlights)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Connected Airports</span>
          <span className="text-white">
            {formatNumber(stats.connectedAirports)}
          </span>
        </div>
      </div>
    </div>
  );
}
