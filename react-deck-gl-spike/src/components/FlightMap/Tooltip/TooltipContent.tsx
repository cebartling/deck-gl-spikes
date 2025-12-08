import type { FlightRoute } from '../../../types/flight';

interface TooltipContentProps {
  route: FlightRoute;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function formatDistance(km: number): string {
  return `${formatNumber(Math.round(km))} km`;
}

export function TooltipContent({ route }: TooltipContentProps) {
  return (
    <div className="space-y-3">
      {/* Route Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-cyan-400">
          {route.origin.code}
        </span>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
        <span className="text-lg font-semibold text-pink-400">
          {route.destination.code}
        </span>
      </div>

      {/* Origin Airport */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          Origin
        </div>
        <div className="text-white font-medium">{route.origin.name}</div>
        <div className="text-gray-400 text-sm">
          {route.origin.city}, {route.origin.country}
        </div>
      </div>

      {/* Destination Airport */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          Destination
        </div>
        <div className="text-white font-medium">{route.destination.name}</div>
        <div className="text-gray-400 text-sm">
          {route.destination.city}, {route.destination.country}
        </div>
      </div>

      {/* Route Statistics */}
      <div className="pt-2 border-t border-gray-700 grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Frequency
          </div>
          <div className="text-white">
            {route.frequency}{' '}
            <span className="text-gray-400">flights/week</span>
          </div>
        </div>

        {route.distance && (
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Distance
            </div>
            <div className="text-white">{formatDistance(route.distance)}</div>
          </div>
        )}

        {route.passengerVolume && (
          <div className="col-span-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Annual Passengers
            </div>
            <div className="text-white">
              {formatNumber(route.passengerVolume)}
            </div>
          </div>
        )}

        {route.airline && (
          <div className="col-span-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Airline
            </div>
            <div className="text-white">{route.airline}</div>
          </div>
        )}
      </div>
    </div>
  );
}
