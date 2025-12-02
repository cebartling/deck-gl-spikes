import type { Earthquake } from '../types/earthquake';
import type { DateRange } from '../types/filters';

/**
 * Filter earthquakes by date range.
 * Returns all earthquakes if range is null/undefined.
 */
export function filterByDateRange(
  earthquakes: Earthquake[],
  dateRange: DateRange
): Earthquake[] {
  const { startDate, endDate } = dateRange;

  // No filter applied
  if (!startDate && !endDate) {
    return earthquakes;
  }

  return earthquakes.filter((eq) => {
    const timestamp = new Date(eq.timestamp).getTime();

    if (startDate && timestamp < startDate.getTime()) {
      return false;
    }

    if (endDate) {
      // Include end date (end of day in UTC)
      const endOfDay = new Date(endDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      if (timestamp > endOfDay.getTime()) {
        return false;
      }
    }

    return true;
  });
}
