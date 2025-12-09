import type {
  ScheduledFlight,
  FlightPosition,
} from '../../../types/flightSchedule';
import {
  interpolateGreatCircle,
  calculateBearing,
  estimateAltitude,
} from '../../../utils/greatCircle';

/**
 * Calculate the current position of a flight based on animation time
 * @param flight - The scheduled flight
 * @param currentTime - Current animation time in minutes from midnight (0-1440)
 * @returns FlightPosition if flight is in the air, null otherwise
 */
export function calculateFlightPosition(
  flight: ScheduledFlight,
  currentTime: number
): FlightPosition | null {
  const departureTime = flight.departureTime;
  let arrivalTime = flight.arrivalTime;

  // Handle overnight flights (arrival before departure in 24h time)
  if (arrivalTime < departureTime) {
    arrivalTime += 1440; // Add 24 hours
  }

  // Adjust current time for overnight comparison
  let adjustedCurrentTime = currentTime;
  if (currentTime < departureTime && arrivalTime > 1440) {
    adjustedCurrentTime += 1440;
  }

  // Check if flight is currently in the air
  if (
    adjustedCurrentTime < departureTime ||
    adjustedCurrentTime > arrivalTime
  ) {
    return null;
  }

  // Calculate progress (0-1)
  const flightDuration = arrivalTime - departureTime;
  const elapsed = adjustedCurrentTime - departureTime;
  const progress = Math.min(Math.max(elapsed / flightDuration, 0), 1);

  // Interpolate position along great circle path
  const [longitude, latitude] = interpolateGreatCircle(
    flight.origin.latitude,
    flight.origin.longitude,
    flight.destination.latitude,
    flight.destination.longitude,
    progress
  );

  // Calculate bearing for aircraft icon rotation
  const bearing = calculateBearing(
    flight.origin.latitude,
    flight.origin.longitude,
    flight.destination.latitude,
    flight.destination.longitude
  );

  // Estimate altitude
  const altitude = estimateAltitude(progress);

  return {
    flightId: flight.id,
    flightNumber: flight.flightNumber,
    longitude,
    latitude,
    bearing,
    progress,
    altitude,
    origin: flight.origin.code,
    destination: flight.destination.code,
  };
}

/**
 * Calculate positions for all active flights at a given time
 * @param flights - Array of scheduled flights
 * @param currentTime - Current animation time in minutes from midnight
 * @param airportFilter - Optional airport code to filter by
 * @returns Array of FlightPosition for all active flights
 */
export function calculateActiveFlightPositions(
  flights: ScheduledFlight[],
  currentTime: number,
  airportFilter?: string
): FlightPosition[] {
  const positions: FlightPosition[] = [];

  for (const flight of flights) {
    // Apply airport filter if specified
    if (airportFilter) {
      const isOrigin = flight.origin.code === airportFilter;
      const isDestination = flight.destination.code === airportFilter;
      if (!isOrigin && !isDestination) continue;
    }

    const position = calculateFlightPosition(flight, currentTime);
    if (position) {
      positions.push(position);
    }
  }

  return positions;
}
