/**
 * Format magnitude with appropriate precision and descriptor
 */
export function formatMagnitude(magnitude: number): {
  value: string;
  descriptor: string;
} {
  const value = magnitude.toFixed(1);

  let descriptor: string;
  if (magnitude < 3) descriptor = 'Minor';
  else if (magnitude < 4) descriptor = 'Light';
  else if (magnitude < 5) descriptor = 'Moderate';
  else if (magnitude < 6) descriptor = 'Strong';
  else if (magnitude < 7) descriptor = 'Major';
  else descriptor = 'Great';

  return { value, descriptor };
}

/**
 * Format depth with unit and classification
 */
export function formatDepth(depthKm: number): {
  value: string;
  classification: string;
} {
  const value =
    depthKm < 100
      ? `${depthKm.toFixed(1)} km`
      : `${Math.round(depthKm)} km`;

  let classification: string;
  if (depthKm < 70) classification = 'Shallow';
  else if (depthKm < 300) classification = 'Intermediate';
  else classification = 'Deep';

  return { value, classification };
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return '';
}

/**
 * Format ISO timestamp to localized date/time
 */
export function formatDateTime(isoTimestamp: string): {
  date: string;
  time: string;
  relative: string;
} {
  const date = new Date(isoTimestamp);

  return {
    date: date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }),
    relative: getRelativeTime(date),
  };
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lng: number, lat: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  return `${Math.abs(lat).toFixed(3)}°${latDir}, ${Math.abs(lng).toFixed(3)}°${lngDir}`;
}

/**
 * Format number with thousands separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${Math.abs(value).toFixed(decimals)}%`;
}

/**
 * Format compact number (e.g., 1.5M, 250K)
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}
