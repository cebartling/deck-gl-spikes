import { useEffect, useState, useCallback } from 'react';
import { useFlightAnimationStore } from '../stores/flightAnimationStore';
import {
  ScheduledFlightsResponseSchema,
  type ScheduledFlight,
} from '../types/flightSchedule';

const FLIGHT_SCHEDULES_URL = '/data/flight-schedules.json';

interface UseFlightScheduleDataResult {
  flights: ScheduledFlight[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFlightScheduleData(
  url: string = FLIGHT_SCHEDULES_URL
): UseFlightScheduleDataResult {
  const scheduledFlights = useFlightAnimationStore(
    (state) => state.scheduledFlights
  );
  const setScheduledFlights = useFlightAnimationStore(
    (state) => state.setScheduledFlights
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch flight schedules: ${response.status}`);
      }

      const data = await response.json();
      const parsed = ScheduledFlightsResponseSchema.safeParse(data);

      if (!parsed.success) {
        throw new Error(
          `Invalid flight schedule data: ${parsed.error.message}`
        );
      }

      setScheduledFlights(parsed.data.flights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, setScheduledFlights]);

  useEffect(() => {
    // Fetch schedules if not already loaded
    if (scheduledFlights.length === 0 && !loading && !error) {
      fetchSchedules();
    }
  }, [scheduledFlights.length, loading, error, fetchSchedules]);

  return {
    flights: scheduledFlights,
    loading,
    error,
    refetch: fetchSchedules,
  };
}
