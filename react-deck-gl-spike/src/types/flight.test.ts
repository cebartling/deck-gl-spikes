import { describe, it, expect } from 'vitest';
import { AirportSchema, FlightRouteSchema } from './flight';

describe('AirportSchema', () => {
  const validAirport = {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'USA',
    longitude: -118.4085,
    latitude: 33.9425,
  };

  it('validates a valid airport', () => {
    const result = AirportSchema.safeParse(validAirport);
    expect(result.success).toBe(true);
  });

  it('rejects invalid longitude (< -180)', () => {
    const result = AirportSchema.safeParse({
      ...validAirport,
      longitude: -181,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid longitude (> 180)', () => {
    const result = AirportSchema.safeParse({
      ...validAirport,
      longitude: 181,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid latitude (< -90)', () => {
    const result = AirportSchema.safeParse({
      ...validAirport,
      latitude: -91,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid latitude (> 90)', () => {
    const result = AirportSchema.safeParse({
      ...validAirport,
      latitude: 91,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = AirportSchema.safeParse({ code: 'LAX' });
    expect(result.success).toBe(false);
  });
});

describe('FlightRouteSchema', () => {
  const validAirport = {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'USA',
    longitude: -118.4085,
    latitude: 33.9425,
  };

  const validDestination = {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'USA',
    longitude: -73.7781,
    latitude: 40.6413,
  };

  const validRoute = {
    id: 'LAX-JFK',
    origin: validAirport,
    destination: validDestination,
    frequency: 280,
  };

  it('validates a valid flight route', () => {
    const result = FlightRouteSchema.safeParse(validRoute);
    expect(result.success).toBe(true);
  });

  it('validates a route with optional fields', () => {
    const result = FlightRouteSchema.safeParse({
      ...validRoute,
      passengerVolume: 4500000,
      airline: 'Delta',
      distance: 3983,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative frequency', () => {
    const result = FlightRouteSchema.safeParse({
      ...validRoute,
      frequency: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative passenger volume', () => {
    const result = FlightRouteSchema.safeParse({
      ...validRoute,
      passengerVolume: -1000,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative distance', () => {
    const result = FlightRouteSchema.safeParse({
      ...validRoute,
      distance: -100,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing origin', () => {
    const result = FlightRouteSchema.safeParse({
      id: validRoute.id,
      destination: validRoute.destination,
      frequency: validRoute.frequency,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing destination', () => {
    const result = FlightRouteSchema.safeParse({
      id: validRoute.id,
      origin: validRoute.origin,
      frequency: validRoute.frequency,
    });
    expect(result.success).toBe(false);
  });
});
