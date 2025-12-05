import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTooltip } from './useTooltip';
import type { CountyFeature } from '../../../types/county';
import type { PickingInfo } from '@deck.gl/core';

describe('useTooltip', () => {
  const mockCountyFeature: CountyFeature = {
    type: 'Feature',
    properties: {
      fips: '06001',
      name: 'Alameda',
      state: 'CA',
      stateFips: '06',
      totalVotes: 500000,
      democratVotes: 350000,
      republicanVotes: 130000,
      otherVotes: 20000,
      margin: 220000,
      marginPercent: 44,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.0, 37.5],
          [-122.5, 37.5],
          [-122.5, 38.0],
          [-122.0, 38.0],
          [-122.0, 37.5],
        ],
      ],
    },
  };

  const createPickingInfo = (
    object: CountyFeature | undefined,
    picked: boolean,
    x = 100,
    y = 200
  ): PickingInfo<CountyFeature> => ({
    object,
    picked,
    x,
    y,
    color: null,
    index: 0,
    layer: null as never,
    coordinate: undefined,
    viewport: undefined,
    sourceLayer: undefined,
    devicePixel: undefined,
    pixelRatio: 1,
  });

  it('initializes with null tooltip', () => {
    const { result } = renderHook(() => useTooltip());

    expect(result.current.tooltip).toBeNull();
    expect(result.current.hoveredFips).toBeNull();
  });

  it('sets tooltip when object is picked on hover', () => {
    const { result } = renderHook(() => useTooltip());

    act(() => {
      result.current.onHover(createPickingInfo(mockCountyFeature, true, 150, 250));
    });

    expect(result.current.tooltip).not.toBeNull();
    expect(result.current.tooltip?.object).toBe(mockCountyFeature);
    expect(result.current.tooltip?.x).toBe(150);
    expect(result.current.tooltip?.y).toBe(250);
  });

  it('clears tooltip when no object is picked', () => {
    const { result } = renderHook(() => useTooltip());

    // First set a tooltip
    act(() => {
      result.current.onHover(createPickingInfo(mockCountyFeature, true));
    });

    expect(result.current.tooltip).not.toBeNull();

    // Then clear it
    act(() => {
      result.current.onHover(createPickingInfo(undefined, false));
    });

    expect(result.current.tooltip).toBeNull();
  });

  it('clears tooltip when picked is false', () => {
    const { result } = renderHook(() => useTooltip());

    // Set a tooltip
    act(() => {
      result.current.onHover(createPickingInfo(mockCountyFeature, true));
    });

    // Clear when picked is false (even with object)
    act(() => {
      result.current.onHover(createPickingInfo(mockCountyFeature, false));
    });

    expect(result.current.tooltip).toBeNull();
  });

  it('returns hoveredFips from tooltip object', () => {
    const { result } = renderHook(() => useTooltip());

    act(() => {
      result.current.onHover(createPickingInfo(mockCountyFeature, true));
    });

    expect(result.current.hoveredFips).toBe('06001');
  });

  it('returns null hoveredFips when no tooltip', () => {
    const { result } = renderHook(() => useTooltip());

    expect(result.current.hoveredFips).toBeNull();
  });

  it('clearTooltip sets tooltip to null', () => {
    const { result } = renderHook(() => useTooltip());

    // Set a tooltip
    act(() => {
      result.current.onHover(createPickingInfo(mockCountyFeature, true));
    });

    expect(result.current.tooltip).not.toBeNull();

    // Clear it
    act(() => {
      result.current.clearTooltip();
    });

    expect(result.current.tooltip).toBeNull();
    expect(result.current.hoveredFips).toBeNull();
  });

  it('updates position when hovering different locations', () => {
    const { result } = renderHook(() => useTooltip());

    act(() => {
      result.current.onHover(createPickingInfo(mockCountyFeature, true, 100, 100));
    });

    expect(result.current.tooltip?.x).toBe(100);
    expect(result.current.tooltip?.y).toBe(100);

    act(() => {
      result.current.onHover(createPickingInfo(mockCountyFeature, true, 200, 300));
    });

    expect(result.current.tooltip?.x).toBe(200);
    expect(result.current.tooltip?.y).toBe(300);
  });

  it('updates object when hovering different counties', () => {
    const anotherCounty: CountyFeature = {
      ...mockCountyFeature,
      properties: {
        ...mockCountyFeature.properties,
        fips: '48201',
        name: 'Harris',
        state: 'TX',
      },
    };

    const { result } = renderHook(() => useTooltip());

    act(() => {
      result.current.onHover(createPickingInfo(mockCountyFeature, true));
    });

    expect(result.current.hoveredFips).toBe('06001');

    act(() => {
      result.current.onHover(createPickingInfo(anotherCounty, true));
    });

    expect(result.current.hoveredFips).toBe('48201');
    expect(result.current.tooltip?.object?.properties.name).toBe('Harris');
  });

  it('onHover callback is stable', () => {
    const { result, rerender } = renderHook(() => useTooltip());

    const firstOnHover = result.current.onHover;

    rerender();

    expect(result.current.onHover).toBe(firstOnHover);
  });

  it('clearTooltip callback is stable', () => {
    const { result, rerender } = renderHook(() => useTooltip());

    const firstClearTooltip = result.current.clearTooltip;

    rerender();

    expect(result.current.clearTooltip).toBe(firstClearTooltip);
  });
});
