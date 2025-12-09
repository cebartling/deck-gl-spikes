import { describe, it, expect } from 'vitest';
import {
  ScheduledFlightSchema,
  ScheduledFlightsResponseSchema,
} from './flightSchedule';

describe('flightSchedule schemas', () => {
  describe('ScheduledFlightSchema', () => {
    const validFlight = {
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
      departureTime: 360,
      arrivalTime: 660,
    };

    it('validates a valid flight', () => {
      const result = ScheduledFlightSchema.safeParse(validFlight);
      expect(result.success).toBe(true);
    });

    it('validates flight with optional fields', () => {
      const flightWithOptionals = {
        ...validFlight,
        airline: 'American Airlines',
        aircraftType: 'Boeing 777',
      };
      const result = ScheduledFlightSchema.safeParse(flightWithOptionals);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.airline).toBe('American Airlines');
        expect(result.data.aircraftType).toBe('Boeing 777');
      }
    });

    it('rejects missing required fields', () => {
      const invalidFlight = { ...validFlight };
      delete (invalidFlight as Record<string, unknown>).id;
      const result = ScheduledFlightSchema.safeParse(invalidFlight);
      expect(result.success).toBe(false);
    });

    it('rejects departure time below 0', () => {
      const invalidFlight = { ...validFlight, departureTime: -1 };
      const result = ScheduledFlightSchema.safeParse(invalidFlight);
      expect(result.success).toBe(false);
    });

    it('rejects departure time above 1440', () => {
      const invalidFlight = { ...validFlight, departureTime: 1441 };
      const result = ScheduledFlightSchema.safeParse(invalidFlight);
      expect(result.success).toBe(false);
    });

    it('rejects arrival time below 0', () => {
      const invalidFlight = { ...validFlight, arrivalTime: -1 };
      const result = ScheduledFlightSchema.safeParse(invalidFlight);
      expect(result.success).toBe(false);
    });

    it('rejects arrival time above 1440', () => {
      const invalidFlight = { ...validFlight, arrivalTime: 1441 };
      const result = ScheduledFlightSchema.safeParse(invalidFlight);
      expect(result.success).toBe(false);
    });

    it('accepts boundary time values', () => {
      const boundaryFlight = {
        ...validFlight,
        departureTime: 0,
        arrivalTime: 1440,
      };
      const result = ScheduledFlightSchema.safeParse(boundaryFlight);
      expect(result.success).toBe(true);
    });
  });

  describe('ScheduledFlightsResponseSchema', () => {
    const validResponse = {
      flights: [
        {
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
          departureTime: 360,
          arrivalTime: 660,
        },
      ],
    };

    it('validates response with flights only', () => {
      const result = ScheduledFlightsResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('validates response with metadata', () => {
      const responseWithMetadata = {
        ...validResponse,
        metadata: {
          totalFlights: 1,
          timezone: 'America/Los_Angeles',
        },
      };
      const result =
        ScheduledFlightsResponseSchema.safeParse(responseWithMetadata);
      expect(result.success).toBe(true);
    });

    it('validates response with partial metadata', () => {
      const responseWithPartialMetadata = {
        ...validResponse,
        metadata: {
          generatedAt: '2024-01-15T00:00:00Z',
          description: 'Sample flights',
        },
      };
      const result = ScheduledFlightsResponseSchema.safeParse(
        responseWithPartialMetadata
      );
      expect(result.success).toBe(true);
    });

    it('validates empty flights array', () => {
      const emptyResponse = { flights: [] };
      const result = ScheduledFlightsResponseSchema.safeParse(emptyResponse);
      expect(result.success).toBe(true);
    });

    it('rejects missing flights array', () => {
      const invalidResponse = {};
      const result = ScheduledFlightsResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('rejects invalid flight in array', () => {
      const invalidResponse = {
        flights: [{ id: 'AA100' }], // Missing required fields
      };
      const result = ScheduledFlightsResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });
});
