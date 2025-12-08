// Width range in pixels
const MIN_WIDTH = 1;
const MAX_WIDTH = 8;

export function frequencyToWidth(
  frequency: number,
  maxFrequency: number
): number {
  if (maxFrequency === 0) return MIN_WIDTH;

  // Logarithmic scale for better visual distribution
  const normalizedFreq = Math.log(frequency + 1) / Math.log(maxFrequency + 1);
  return MIN_WIDTH + normalizedFreq * (MAX_WIDTH - MIN_WIDTH);
}

export function passengerVolumeToWidth(
  volume: number,
  maxVolume: number
): number {
  if (maxVolume === 0) return MIN_WIDTH;

  // Square root scale for passenger volume
  const normalizedVol = Math.sqrt(volume) / Math.sqrt(maxVolume);
  return MIN_WIDTH + normalizedVol * (MAX_WIDTH - MIN_WIDTH);
}
