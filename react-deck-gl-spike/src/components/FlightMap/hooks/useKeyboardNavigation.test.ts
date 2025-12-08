import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { useFlightMapViewStore } from '../../../stores';

describe('useKeyboardNavigation', () => {
  beforeEach(() => {
    useFlightMapViewStore.getState().reset();
  });

  afterEach(() => {
    // Clean up any remaining event listeners
  });

  function dispatchKeydown(key: string) {
    act(() => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      window.dispatchEvent(event);
    });
  }

  it('ArrowUp increases latitude', () => {
    const initialLat = useFlightMapViewStore.getState().viewState.latitude;
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('ArrowUp');

    const newLat = useFlightMapViewStore.getState().viewState.latitude;
    expect(newLat).toBe(initialLat + 0.5);
  });

  it('ArrowDown decreases latitude', () => {
    const initialLat = useFlightMapViewStore.getState().viewState.latitude;
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('ArrowDown');

    const newLat = useFlightMapViewStore.getState().viewState.latitude;
    expect(newLat).toBe(initialLat - 0.5);
  });

  it('ArrowLeft decreases longitude', () => {
    const initialLng = useFlightMapViewStore.getState().viewState.longitude;
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('ArrowLeft');

    const newLng = useFlightMapViewStore.getState().viewState.longitude;
    expect(newLng).toBe(initialLng - 0.5);
  });

  it('ArrowRight increases longitude', () => {
    const initialLng = useFlightMapViewStore.getState().viewState.longitude;
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('ArrowRight');

    const newLng = useFlightMapViewStore.getState().viewState.longitude;
    expect(newLng).toBe(initialLng + 0.5);
  });

  it('+ increases zoom', () => {
    const initialZoom = useFlightMapViewStore.getState().viewState.zoom;
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('+');

    const newZoom = useFlightMapViewStore.getState().viewState.zoom;
    expect(newZoom).toBe(initialZoom + 0.5);
  });

  it('= increases zoom (same key without shift)', () => {
    const initialZoom = useFlightMapViewStore.getState().viewState.zoom;
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('=');

    const newZoom = useFlightMapViewStore.getState().viewState.zoom;
    expect(newZoom).toBe(initialZoom + 0.5);
  });

  it('- decreases zoom', () => {
    const initialZoom = useFlightMapViewStore.getState().viewState.zoom;
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('-');

    const newZoom = useFlightMapViewStore.getState().viewState.zoom;
    expect(newZoom).toBe(initialZoom - 0.5);
  });

  it('zoom respects maxZoom of 12', () => {
    useFlightMapViewStore.getState().setZoom(12);
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('+');

    const newZoom = useFlightMapViewStore.getState().viewState.zoom;
    expect(newZoom).toBe(12);
  });

  it('zoom respects minZoom of 2', () => {
    useFlightMapViewStore.getState().setZoom(2);
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('-');

    const newZoom = useFlightMapViewStore.getState().viewState.zoom;
    expect(newZoom).toBe(2);
  });

  it('Home resets view', () => {
    useFlightMapViewStore.getState().setViewState({
      longitude: -122.4,
      latitude: 37.8,
      zoom: 10,
      pitch: 60,
      bearing: 90,
    });

    renderHook(() => useKeyboardNavigation());
    dispatchKeydown('Home');

    const { viewState } = useFlightMapViewStore.getState();
    // resetView adds transition properties, so check core values
    expect(viewState.longitude).toBeCloseTo(-98.5795, 2);
    expect(viewState.latitude).toBeCloseTo(39.8283, 2);
    expect(viewState.zoom).toBe(4);
  });

  it('adds transition duration for keyboard navigation', () => {
    renderHook(() => useKeyboardNavigation());

    dispatchKeydown('ArrowUp');

    const { transitionDuration } = useFlightMapViewStore.getState().viewState;
    expect(transitionDuration).toBe(100);
  });
});
