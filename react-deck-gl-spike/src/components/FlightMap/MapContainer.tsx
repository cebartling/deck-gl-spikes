import { useFlightRoutesData } from '../../hooks/useFlightRoutesData';
import { FlightMap } from './FlightMap';

export function FlightMapContainer() {
  const { routes, loading, error } = useFlightRoutesData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="bg-gray-800/80 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-white/10">
          <div className="text-gray-100">Loading flight routes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="bg-red-900/80 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-red-500/30">
          <div className="text-red-200">Error: {error.message}</div>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="bg-gray-800/80 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-white/10">
          <div className="text-gray-400">No flight routes available</div>
        </div>
      </div>
    );
  }

  return <FlightMap routes={routes} />;
}
