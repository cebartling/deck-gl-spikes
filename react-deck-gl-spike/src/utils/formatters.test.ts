import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatMagnitude,
  formatDepth,
  formatDateTime,
  formatCoordinates,
} from './formatters';

describe('formatMagnitude', () => {
  it('returns correct value with one decimal place', () => {
    const result = formatMagnitude(5.67);
    expect(result.value).toBe('5.7');
  });

  it('returns "Minor" for magnitude < 3', () => {
    expect(formatMagnitude(2.9).descriptor).toBe('Minor');
    expect(formatMagnitude(0.5).descriptor).toBe('Minor');
    expect(formatMagnitude(2.0).descriptor).toBe('Minor');
  });

  it('returns "Light" for magnitude 3-3.9', () => {
    expect(formatMagnitude(3.0).descriptor).toBe('Light');
    expect(formatMagnitude(3.5).descriptor).toBe('Light');
    expect(formatMagnitude(3.9).descriptor).toBe('Light');
  });

  it('returns "Moderate" for magnitude 4-4.9', () => {
    expect(formatMagnitude(4.0).descriptor).toBe('Moderate');
    expect(formatMagnitude(4.5).descriptor).toBe('Moderate');
    expect(formatMagnitude(4.9).descriptor).toBe('Moderate');
  });

  it('returns "Strong" for magnitude 5-5.9', () => {
    expect(formatMagnitude(5.0).descriptor).toBe('Strong');
    expect(formatMagnitude(5.5).descriptor).toBe('Strong');
    expect(formatMagnitude(5.9).descriptor).toBe('Strong');
  });

  it('returns "Major" for magnitude 6-6.9', () => {
    expect(formatMagnitude(6.0).descriptor).toBe('Major');
    expect(formatMagnitude(6.5).descriptor).toBe('Major');
    expect(formatMagnitude(6.9).descriptor).toBe('Major');
  });

  it('returns "Great" for magnitude >= 7', () => {
    expect(formatMagnitude(7.0).descriptor).toBe('Great');
    expect(formatMagnitude(8.5).descriptor).toBe('Great');
    expect(formatMagnitude(9.0).descriptor).toBe('Great');
  });

  it('handles boundary values correctly', () => {
    expect(formatMagnitude(2.999).descriptor).toBe('Minor');
    expect(formatMagnitude(3.0).descriptor).toBe('Light');
    expect(formatMagnitude(6.999).descriptor).toBe('Major');
    expect(formatMagnitude(7.0).descriptor).toBe('Great');
  });
});

describe('formatDepth', () => {
  it('returns depth with km unit', () => {
    expect(formatDepth(50).value).toContain('km');
    expect(formatDepth(200).value).toContain('km');
  });

  it('returns depth with one decimal for depths < 100', () => {
    expect(formatDepth(50.5).value).toBe('50.5 km');
    expect(formatDepth(99.9).value).toBe('99.9 km');
  });

  it('returns rounded depth for depths >= 100', () => {
    expect(formatDepth(100.5).value).toBe('101 km');
    expect(formatDepth(350.7).value).toBe('351 km');
  });

  it('returns "Shallow" for depth < 70', () => {
    expect(formatDepth(10).classification).toBe('Shallow');
    expect(formatDepth(50).classification).toBe('Shallow');
    expect(formatDepth(69.9).classification).toBe('Shallow');
  });

  it('returns "Intermediate" for depth 70-299', () => {
    expect(formatDepth(70).classification).toBe('Intermediate');
    expect(formatDepth(150).classification).toBe('Intermediate');
    expect(formatDepth(299).classification).toBe('Intermediate');
  });

  it('returns "Deep" for depth >= 300', () => {
    expect(formatDepth(300).classification).toBe('Deep');
    expect(formatDepth(500).classification).toBe('Deep');
    expect(formatDepth(700).classification).toBe('Deep');
  });

  it('handles boundary values correctly', () => {
    expect(formatDepth(69.999).classification).toBe('Shallow');
    expect(formatDepth(70).classification).toBe('Intermediate');
    expect(formatDepth(299.999).classification).toBe('Intermediate');
    expect(formatDepth(300).classification).toBe('Deep');
  });
});

describe('formatDateTime', () => {
  beforeEach(() => {
    // Mock current time for consistent relative time tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns formatted date string', () => {
    const result = formatDateTime('2024-01-15T10:30:00Z');
    expect(result.date).toBeTruthy();
    expect(typeof result.date).toBe('string');
  });

  it('returns formatted time string', () => {
    const result = formatDateTime('2024-01-15T10:30:00Z');
    expect(result.time).toBeTruthy();
    expect(typeof result.time).toBe('string');
  });

  it('returns "just now" for events less than a minute ago', () => {
    const result = formatDateTime('2024-01-15T11:59:30Z');
    expect(result.relative).toBe('just now');
  });

  it('returns minutes ago for recent events', () => {
    const result = formatDateTime('2024-01-15T11:30:00Z');
    expect(result.relative).toBe('30 min ago');
  });

  it('returns hours ago for events within 24 hours', () => {
    const result = formatDateTime('2024-01-15T06:00:00Z');
    expect(result.relative).toBe('6 hours ago');
  });

  it('returns days ago for events within a week', () => {
    const result = formatDateTime('2024-01-12T12:00:00Z');
    expect(result.relative).toBe('3 days ago');
  });

  it('returns empty string for events older than a week', () => {
    const result = formatDateTime('2024-01-01T12:00:00Z');
    expect(result.relative).toBe('');
  });
});

describe('formatCoordinates', () => {
  it('formats positive latitude with N', () => {
    const result = formatCoordinates(0, 45.678);
    expect(result).toContain('45.678°N');
  });

  it('formats negative latitude with S', () => {
    const result = formatCoordinates(0, -45.678);
    expect(result).toContain('45.678°S');
  });

  it('formats positive longitude with E', () => {
    const result = formatCoordinates(122.456, 0);
    expect(result).toContain('122.456°E');
  });

  it('formats negative longitude with W', () => {
    const result = formatCoordinates(-122.456, 0);
    expect(result).toContain('122.456°W');
  });

  it('returns correct precision (3 decimal places)', () => {
    const result = formatCoordinates(-122.45678, 37.12345);
    expect(result).toBe('37.123°N, 122.457°W');
  });

  it('handles zero coordinates', () => {
    const result = formatCoordinates(0, 0);
    expect(result).toBe('0.000°N, 0.000°E');
  });

  it('handles San Francisco coordinates correctly', () => {
    const result = formatCoordinates(-122.4194, 37.7749);
    expect(result).toBe('37.775°N, 122.419°W');
  });

  it('handles Tokyo coordinates correctly', () => {
    const result = formatCoordinates(139.6917, 35.6895);
    expect(result).toBe('35.690°N, 139.692°E');
  });

  it('handles Sydney coordinates correctly (Southern Hemisphere)', () => {
    const result = formatCoordinates(151.2093, -33.8688);
    expect(result).toBe('33.869°S, 151.209°E');
  });
});
