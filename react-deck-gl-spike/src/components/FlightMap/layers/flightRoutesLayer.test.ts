import { describe, it, expect, vi } from 'vitest';
import { createFlightRoutesLayer } from './flightRoutesLayer';
import type { FlightRoute } from '../../../types/flight';

type PositionAccessor = (d: FlightRoute) => [number, number];
type ColorAccessor = (d: FlightRoute) => [number, number, number, number];
type WidthAccessor = (d: FlightRoute) => number;

const mockRoutes: FlightRoute[] = [
  {
    id: 'LAX-JFK',
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
    frequency: 280,
  },
  {
    id: 'ORD-ATL',
    origin: {
      code: 'ORD',
      name: "O'Hare International Airport",
      city: 'Chicago',
      country: 'USA',
      longitude: -87.9048,
      latitude: 41.9742,
    },
    destination: {
      code: 'ATL',
      name: 'Hartsfield-Jackson Atlanta International Airport',
      city: 'Atlanta',
      country: 'USA',
      longitude: -84.4281,
      latitude: 33.6407,
    },
    frequency: 140,
  },
];

describe('createFlightRoutesLayer', () => {
  it('creates an ArcLayer instance', () => {
    const layer = createFlightRoutesLayer({ data: mockRoutes });
    expect(layer).toBeDefined();
    expect(layer.id).toBe('flight-routes-layer');
  });

  it('layer is pickable', () => {
    const layer = createFlightRoutesLayer({ data: mockRoutes });
    expect(layer.props.pickable).toBe(true);
  });

  it('uses great circle paths', () => {
    const layer = createFlightRoutesLayer({ data: mockRoutes });
    expect(layer.props.greatCircle).toBe(true);
  });

  it('getSourcePosition returns origin coordinates', () => {
    const layer = createFlightRoutesLayer({ data: mockRoutes });
    const getSourcePosition = layer.props
      .getSourcePosition as unknown as PositionAccessor;
    const position = getSourcePosition(mockRoutes[0]);
    expect(position).toEqual([-118.4085, 33.9425]);
  });

  it('getTargetPosition returns destination coordinates', () => {
    const layer = createFlightRoutesLayer({ data: mockRoutes });
    const getTargetPosition = layer.props
      .getTargetPosition as unknown as PositionAccessor;
    const position = getTargetPosition(mockRoutes[0]);
    expect(position).toEqual([-73.7781, 40.6413]);
  });

  it('getSourceColor returns a valid RGBA array', () => {
    const layer = createFlightRoutesLayer({ data: mockRoutes });
    const getSourceColor = layer.props
      .getSourceColor as unknown as ColorAccessor;
    const color = getSourceColor(mockRoutes[0]);
    expect(Array.isArray(color)).toBe(true);
    expect(color).toHaveLength(4);
    expect(color.every((v: number) => v >= 0 && v <= 255)).toBe(true);
  });

  it('getTargetColor returns a valid RGBA array', () => {
    const layer = createFlightRoutesLayer({ data: mockRoutes });
    const getTargetColor = layer.props
      .getTargetColor as unknown as ColorAccessor;
    const color = getTargetColor(mockRoutes[0]);
    expect(Array.isArray(color)).toBe(true);
    expect(color).toHaveLength(4);
    expect(color.every((v: number) => v >= 0 && v <= 255)).toBe(true);
  });

  it('getWidth returns a positive number', () => {
    const layer = createFlightRoutesLayer({ data: mockRoutes });
    const getWidth = layer.props.getWidth as unknown as WidthAccessor;
    const width = getWidth(mockRoutes[0]);
    expect(typeof width).toBe('number');
    expect(width).toBeGreaterThan(0);
  });

  it('highlighted route has increased width', () => {
    const layer = createFlightRoutesLayer({
      data: mockRoutes,
      highlightedRouteId: 'LAX-JFK',
    });
    const getWidth = layer.props.getWidth as unknown as WidthAccessor;
    const highlightedWidth = getWidth(mockRoutes[0]);
    const normalWidth = getWidth(mockRoutes[1]);

    expect(highlightedWidth).toBeGreaterThan(normalWidth);
  });

  it('highlighted route has full opacity source color', () => {
    const layer = createFlightRoutesLayer({
      data: mockRoutes,
      highlightedRouteId: 'LAX-JFK',
    });
    const getSourceColor = layer.props
      .getSourceColor as unknown as ColorAccessor;
    const color = getSourceColor(mockRoutes[0]);
    expect(color[3]).toBe(255);
  });

  it('non-highlighted routes are dimmed when something is highlighted', () => {
    const layer = createFlightRoutesLayer({
      data: mockRoutes,
      highlightedRouteId: 'LAX-JFK',
    });
    const getSourceColor = layer.props
      .getSourceColor as unknown as ColorAccessor;
    const color = getSourceColor(mockRoutes[1]);
    expect(color[3]).toBe(80);
  });

  it('calls onHover callback', () => {
    const onHover = vi.fn();
    const layer = createFlightRoutesLayer({
      data: mockRoutes,
      onHover,
    });
    expect(layer.props.onHover).toBe(onHover);
  });

  it('calls onClick callback', () => {
    const onClick = vi.fn();
    const layer = createFlightRoutesLayer({
      data: mockRoutes,
      onClick,
    });
    expect(layer.props.onClick).toBe(onClick);
  });

  it('has updateTriggers for reactivity', () => {
    const layer = createFlightRoutesLayer({
      data: mockRoutes,
      highlightedRouteId: 'LAX-JFK',
    });
    expect(layer.props.updateTriggers).toBeDefined();
    expect(layer.props.updateTriggers?.getSourceColor).toBeDefined();
    expect(layer.props.updateTriggers?.getTargetColor).toBeDefined();
    expect(layer.props.updateTriggers?.getWidth).toBeDefined();
  });

  it('has transitions for smooth updates', () => {
    const layer = createFlightRoutesLayer({ data: mockRoutes });
    expect(layer.props.transitions).toBeDefined();
    expect(layer.props.transitions?.getSourcePosition).toBe(300);
    expect(layer.props.transitions?.getTargetPosition).toBe(300);
    expect(layer.props.transitions?.getWidth).toBe(300);
  });

  it('handles empty data array', () => {
    const layer = createFlightRoutesLayer({ data: [] });
    expect(layer).toBeDefined();
    expect(layer.props.data).toEqual([]);
  });
});
