import { describe, it, expect } from 'vitest';
import {
  calculateFlightPosition,
  calculateActiveFlightPositions,
} from './flightPositionCalculator';
import type { ScheduledFlight } from '../../../types/flightSchedule';

// Helper to create a mock flight
function createMockFlight(
  overrides: Partial<ScheduledFlight> = {}
): ScheduledFlight {
  return {
    id: 'AA100',
    flightNumber: 'AA100',
    origin: {
      code: 'LAX',
      name: 'Los Angeles International Airport',
      city: 'Los Angeles',
      country: 'USA',
      longitude: -118.4085,
      latitude: 33.9425,
    },
    destination: {
      code: 'JFK',
      name: 'John F. Kennedy International Airport',
      city: 'New York',
      country: 'USA',
      longitude: -73.7781,
      latitude: 40.6413,
    },
    departureTime: 360, // 6:00 AM
    arrivalTime: 660, // 11:00 AM (5 hour flight)
    ...overrides,
  };
}

describe('flightPositionCalculator', () => {
  describe('calculateFlightPosition', () => {
    it('returns null before departure', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 300); // 5:00 AM
      expect(position).toBeNull();
    });

    it('returns null after arrival', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 700); // 11:40 AM
      expect(position).toBeNull();
    });

    it('returns position at departure time', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 360); // 6:00 AM
      expect(position).not.toBeNull();
      expect(position!.progress).toBeCloseTo(0, 2);
      expect(position!.longitude).toBeCloseTo(-118.4085, 2);
      expect(position!.latitude).toBeCloseTo(33.9425, 2);
    });

    it('returns position at arrival time', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 660); // 11:00 AM
      expect(position).not.toBeNull();
      expect(position!.progress).toBeCloseTo(1, 2);
      expect(position!.longitude).toBeCloseTo(-73.7781, 2);
      expect(position!.latitude).toBeCloseTo(40.6413, 2);
    });

    it('returns position at midpoint', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 510); // 8:30 AM (midpoint)
      expect(position).not.toBeNull();
      expect(position!.progress).toBeCloseTo(0.5, 2);
      // Position should be between LAX and JFK
      expect(position!.longitude).toBeGreaterThan(-118);
      expect(position!.longitude).toBeLessThan(-74);
    });

    it('includes correct flight metadata', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 510);
      expect(position!.flightId).toBe('AA100');
      expect(position!.flightNumber).toBe('AA100');
      expect(position!.origin).toBe('LAX');
      expect(position!.destination).toBe('JFK');
    });

    it('calculates bearing towards destination', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 510);
      // LAX to JFK is roughly northeast (45-75 degrees)
      expect(position!.bearing).toBeGreaterThan(50);
      expect(position!.bearing).toBeLessThan(80);
    });

    it('estimates altitude during cruise', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 510); // Midpoint
      expect(position!.altitude).toBe(35000);
    });

    it('estimates lower altitude during climb', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 375); // 6:15 AM (5% progress)
      expect(position!.altitude).toBeLessThan(35000);
      expect(position!.altitude).toBeGreaterThan(0);
    });

    it('estimates lower altitude during descent', () => {
      const flight = createMockFlight();
      const position = calculateFlightPosition(flight, 645); // 10:45 AM (95% progress)
      expect(position!.altitude).toBeLessThan(35000);
      expect(position!.altitude).toBeGreaterThan(0);
    });

    describe('overnight flights', () => {
      it('handles overnight flight during the night', () => {
        const flight = createMockFlight({
          departureTime: 1380, // 11:00 PM
          arrivalTime: 120, // 2:00 AM next day
        });
        const position = calculateFlightPosition(flight, 30); // 12:30 AM
        expect(position).not.toBeNull();
        expect(position!.progress).toBeGreaterThan(0);
        expect(position!.progress).toBeLessThan(1);
      });

      it('returns null for overnight flight before departure', () => {
        const flight = createMockFlight({
          departureTime: 1380, // 11:00 PM
          arrivalTime: 120, // 2:00 AM next day
        });
        const position = calculateFlightPosition(flight, 1320); // 10:00 PM
        expect(position).toBeNull();
      });

      it('returns null for overnight flight after arrival next day', () => {
        const flight = createMockFlight({
          departureTime: 1380, // 11:00 PM
          arrivalTime: 120, // 2:00 AM next day
        });
        const position = calculateFlightPosition(flight, 180); // 3:00 AM
        expect(position).toBeNull();
      });
    });
  });

  describe('calculateActiveFlightPositions', () => {
    const flights: ScheduledFlight[] = [
      createMockFlight({ id: 'AA100', departureTime: 360, arrivalTime: 660 }),
      createMockFlight({
        id: 'DL200',
        flightNumber: 'DL200',
        departureTime: 480,
        arrivalTime: 720,
        origin: {
          code: 'ORD',
          name: "O'Hare International",
          city: 'Chicago',
          country: 'USA',
          longitude: -87.9,
          latitude: 41.97,
        },
      }),
      createMockFlight({
        id: 'UA300',
        flightNumber: 'UA300',
        departureTime: 720,
        arrivalTime: 900,
      }),
    ];

    it('returns empty array when no flights are active', () => {
      const positions = calculateActiveFlightPositions(flights, 300); // 5:00 AM
      expect(positions).toEqual([]);
    });

    it('returns positions for all active flights', () => {
      const positions = calculateActiveFlightPositions(flights, 540); // 9:00 AM
      expect(positions.length).toBe(2);
      expect(positions.map((p) => p.flightId)).toContain('AA100');
      expect(positions.map((p) => p.flightId)).toContain('DL200');
    });

    it('filters by airport (origin)', () => {
      const positions = calculateActiveFlightPositions(flights, 540, 'LAX');
      expect(positions.length).toBe(1);
      expect(positions[0].flightId).toBe('AA100');
    });

    it('filters by airport (destination)', () => {
      const positions = calculateActiveFlightPositions(flights, 540, 'JFK');
      expect(positions.length).toBe(2);
    });

    it('returns empty array when filter matches no flights', () => {
      const positions = calculateActiveFlightPositions(flights, 540, 'SFO');
      expect(positions).toEqual([]);
    });

    it('handles empty flights array', () => {
      const positions = calculateActiveFlightPositions([], 540);
      expect(positions).toEqual([]);
    });
  });
});
