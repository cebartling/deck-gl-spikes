import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlightTooltip } from './useFlightTooltip';
import type { FlightRoute } from '../../../types/flight';

const mockRoute: FlightRoute = {
  id: 'route-1',
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
  frequency: 42,
  distance: 3983,
  passengerVolume: 5000000,
  airline: 'Delta',
};

describe('useFlightTooltip', () => {
  it('initial tooltip state is null', () => {
    const { result } = renderHook(() => useFlightTooltip());

    expect(result.current.tooltip.route).toBeNull();
    expect(result.current.tooltip.x).toBe(0);
    expect(result.current.tooltip.y).toBe(0);
    expect(result.current.hoveredRouteId).toBeNull();
  });

  it('handleHover sets route and position', () => {
    const { result } = renderHook(() => useFlightTooltip());

    act(() => {
      result.current.handleHover({
        object: mockRoute,
        x: 100,
        y: 200,
      });
    });

    expect(result.current.tooltip.route).toBe(mockRoute);
    expect(result.current.tooltip.x).toBe(100);
    expect(result.current.tooltip.y).toBe(200);
    expect(result.current.hoveredRouteId).toBe('route-1');
  });

  it('handleHover with no object clears route but keeps position', () => {
    const { result } = renderHook(() => useFlightTooltip());

    // First, set a route
    act(() => {
      result.current.handleHover({
        object: mockRoute,
        x: 100,
        y: 200,
      });
    });

    // Then clear it
    act(() => {
      result.current.handleHover({
        object: undefined,
        x: 300,
        y: 400,
      });
    });

    expect(result.current.tooltip.route).toBeNull();
    expect(result.current.tooltip.x).toBe(100); // Position preserved from previous
    expect(result.current.tooltip.y).toBe(200);
    expect(result.current.hoveredRouteId).toBeNull();
  });

  it('clearTooltip clears route', () => {
    const { result } = renderHook(() => useFlightTooltip());

    // First, set a route
    act(() => {
      result.current.handleHover({
        object: mockRoute,
        x: 100,
        y: 200,
      });
    });

    // Then clear it
    act(() => {
      result.current.clearTooltip();
    });

    expect(result.current.tooltip.route).toBeNull();
    expect(result.current.hoveredRouteId).toBeNull();
  });

  it('hoveredRouteId returns correct id', () => {
    const { result } = renderHook(() => useFlightTooltip());

    expect(result.current.hoveredRouteId).toBeNull();

    act(() => {
      result.current.handleHover({
        object: mockRoute,
        x: 100,
        y: 200,
      });
    });

    expect(result.current.hoveredRouteId).toBe('route-1');
  });

  it('updates route when hovering different routes', () => {
    const secondRoute: FlightRoute = {
      ...mockRoute,
      id: 'route-2',
      origin: {
        ...mockRoute.origin,
        code: 'SFO',
      },
    };

    const { result } = renderHook(() => useFlightTooltip());

    act(() => {
      result.current.handleHover({
        object: mockRoute,
        x: 100,
        y: 200,
      });
    });

    expect(result.current.hoveredRouteId).toBe('route-1');

    act(() => {
      result.current.handleHover({
        object: secondRoute,
        x: 150,
        y: 250,
      });
    });

    expect(result.current.hoveredRouteId).toBe('route-2');
    expect(result.current.tooltip.x).toBe(150);
    expect(result.current.tooltip.y).toBe(250);
  });
});
