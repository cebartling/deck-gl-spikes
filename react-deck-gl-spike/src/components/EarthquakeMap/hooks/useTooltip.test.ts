import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTooltip } from './useTooltip';
import type { PickingInfo } from '@deck.gl/core';
import type { Earthquake } from '../../../types/earthquake';

describe('useTooltip', () => {
  const mockEarthquake: Earthquake = {
    id: '1',
    longitude: -122.5,
    latitude: 37.5,
    depth: 10,
    magnitude: 4.5,
    timestamp: '2024-01-01T00:00:00Z',
    location: 'San Francisco, CA',
  };

  it('returns initial tooltip state as null', () => {
    const { result } = renderHook(() => useTooltip());

    expect(result.current.tooltip).toBeNull();
  });

  it('onHover with object sets tooltip state', () => {
    const { result } = renderHook(() => useTooltip());

    const pickingInfo: Partial<PickingInfo<Earthquake>> = {
      object: mockEarthquake,
      x: 100,
      y: 200,
    };

    act(() => {
      result.current.onHover(pickingInfo as PickingInfo<Earthquake>);
    });

    expect(result.current.tooltip).not.toBeNull();
    expect(result.current.tooltip?.object).toEqual(mockEarthquake);
  });

  it('onHover without object clears tooltip state', () => {
    const { result } = renderHook(() => useTooltip());

    // First, set a tooltip
    const pickingInfoWithObject: Partial<PickingInfo<Earthquake>> = {
      object: mockEarthquake,
      x: 100,
      y: 200,
    };

    act(() => {
      result.current.onHover(pickingInfoWithObject as PickingInfo<Earthquake>);
    });

    expect(result.current.tooltip).not.toBeNull();

    // Then, clear it by hovering without an object
    const pickingInfoWithoutObject: Partial<PickingInfo<Earthquake>> = {
      object: undefined,
      x: 150,
      y: 250,
    };

    act(() => {
      result.current.onHover(pickingInfoWithoutObject as PickingInfo<Earthquake>);
    });

    expect(result.current.tooltip).toBeNull();
  });

  it('tooltip contains correct x, y coordinates', () => {
    const { result } = renderHook(() => useTooltip());

    const pickingInfo: Partial<PickingInfo<Earthquake>> = {
      object: mockEarthquake,
      x: 150,
      y: 300,
    };

    act(() => {
      result.current.onHover(pickingInfo as PickingInfo<Earthquake>);
    });

    expect(result.current.tooltip?.x).toBe(150);
    expect(result.current.tooltip?.y).toBe(300);
  });

  it('onHover callback is stable across renders', () => {
    const { result, rerender } = renderHook(() => useTooltip());

    const firstOnHover = result.current.onHover;
    rerender();
    const secondOnHover = result.current.onHover;

    expect(firstOnHover).toBe(secondOnHover);
  });
});
