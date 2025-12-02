import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

  describe('dismiss behavior', () => {
    it('tooltip clears after delay when onHover called with null object', () => {
      const { result } = renderHook(() => useTooltip());

      // First, set a tooltip
      act(() => {
        result.current.onHover({
          object: mockEarthquake,
          x: 100,
          y: 200,
        } as PickingInfo<Earthquake>);
      });

      expect(result.current.tooltip).not.toBeNull();

      // Hover without an object (leave the point)
      act(() => {
        result.current.onHover({
          object: undefined,
          x: 150,
          y: 250,
        } as PickingInfo<Earthquake>);
      });

      // Tooltip should still be visible (delay not yet passed)
      expect(result.current.tooltip).not.toBeNull();

      // Advance timer past dismiss delay
      act(() => {
        vi.advanceTimersByTime(60);
      });

      // Now tooltip should be cleared
      expect(result.current.tooltip).toBeNull();
    });

    it('dismiss timer is cleared when new object is hovered', () => {
      const { result } = renderHook(() => useTooltip());

      const earthquake2: Earthquake = {
        ...mockEarthquake,
        id: '2',
        location: 'Tokyo, Japan',
      };

      // Set first tooltip
      act(() => {
        result.current.onHover({
          object: mockEarthquake,
          x: 100,
          y: 200,
        } as PickingInfo<Earthquake>);
      });

      // Start dismiss (hover away)
      act(() => {
        result.current.onHover({
          object: undefined,
          x: 150,
          y: 250,
        } as PickingInfo<Earthquake>);
      });

      // Before timer fires, hover over a new object
      act(() => {
        result.current.onHover({
          object: earthquake2,
          x: 200,
          y: 300,
        } as PickingInfo<Earthquake>);
      });

      // Advance timer past dismiss delay
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Tooltip should show the new object, not be cleared
      expect(result.current.tooltip).not.toBeNull();
      expect(result.current.tooltip?.object.id).toBe('2');
    });

    it('clearTooltip function clears tooltip immediately', () => {
      const { result } = renderHook(() => useTooltip());

      // Set tooltip
      act(() => {
        result.current.onHover({
          object: mockEarthquake,
          x: 100,
          y: 200,
        } as PickingInfo<Earthquake>);
      });

      expect(result.current.tooltip).not.toBeNull();

      // Clear immediately
      act(() => {
        result.current.clearTooltip();
      });

      // Should be cleared without waiting for timer
      expect(result.current.tooltip).toBeNull();
    });

    it('clearTooltip is stable across renders', () => {
      const { result, rerender } = renderHook(() => useTooltip());

      const firstClearTooltip = result.current.clearTooltip;
      rerender();
      const secondClearTooltip = result.current.clearTooltip;

      expect(firstClearTooltip).toBe(secondClearTooltip);
    });
  });

  describe('keyboard dismiss', () => {
    it('Escape key dismisses tooltip', () => {
      const { result } = renderHook(() => useTooltip());

      // Set tooltip
      act(() => {
        result.current.onHover({
          object: mockEarthquake,
          x: 100,
          y: 200,
        } as PickingInfo<Earthquake>);
      });

      expect(result.current.tooltip).not.toBeNull();

      // Simulate Escape key press
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);
      });

      expect(result.current.tooltip).toBeNull();
    });

    it('other keys do not dismiss tooltip', () => {
      const { result } = renderHook(() => useTooltip());

      // Set tooltip
      act(() => {
        result.current.onHover({
          object: mockEarthquake,
          x: 100,
          y: 200,
        } as PickingInfo<Earthquake>);
      });

      expect(result.current.tooltip).not.toBeNull();

      // Simulate other key presses
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));
      });

      // Tooltip should still be visible
      expect(result.current.tooltip).not.toBeNull();
    });

    it('Escape key does nothing when tooltip is not visible', () => {
      const { result } = renderHook(() => useTooltip());

      expect(result.current.tooltip).toBeNull();

      // Simulate Escape key press
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);
      });

      // Should still be null (no error thrown)
      expect(result.current.tooltip).toBeNull();
    });
  });
});
