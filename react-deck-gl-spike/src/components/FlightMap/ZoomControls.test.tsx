import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ZoomControls } from './ZoomControls';
import { useFlightMapViewStore } from '../../stores';

describe('ZoomControls', () => {
  beforeEach(() => {
    useFlightMapViewStore.getState().reset();
  });

  it('renders zoom in, zoom out, and reset buttons', () => {
    render(<ZoomControls />);

    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset view')).toBeInTheDocument();
  });

  it('zoom in increases zoom level', () => {
    const initialZoom = useFlightMapViewStore.getState().viewState.zoom;
    render(<ZoomControls />);

    fireEvent.click(screen.getByLabelText('Zoom in'));

    const newZoom = useFlightMapViewStore.getState().viewState.zoom;
    expect(newZoom).toBe(initialZoom + 1);
  });

  it('zoom out decreases zoom level', () => {
    const initialZoom = useFlightMapViewStore.getState().viewState.zoom;
    render(<ZoomControls />);

    fireEvent.click(screen.getByLabelText('Zoom out'));

    const newZoom = useFlightMapViewStore.getState().viewState.zoom;
    expect(newZoom).toBe(initialZoom - 1);
  });

  it('zoom in respects maxZoom of 12', () => {
    useFlightMapViewStore.getState().setZoom(12);
    render(<ZoomControls />);

    fireEvent.click(screen.getByLabelText('Zoom in'));

    const newZoom = useFlightMapViewStore.getState().viewState.zoom;
    expect(newZoom).toBe(12);
  });

  it('zoom out respects minZoom of 2', () => {
    useFlightMapViewStore.getState().setZoom(2);
    render(<ZoomControls />);

    fireEvent.click(screen.getByLabelText('Zoom out'));

    const newZoom = useFlightMapViewStore.getState().viewState.zoom;
    expect(newZoom).toBe(2);
  });

  it('reset button calls resetView', () => {
    const resetViewSpy = vi.spyOn(
      useFlightMapViewStore.getState(),
      'resetView'
    );

    // Modify the view state
    useFlightMapViewStore.getState().setViewState({
      longitude: -122.4,
      latitude: 37.8,
      zoom: 10,
      pitch: 60,
      bearing: 90,
    });

    render(<ZoomControls />);
    fireEvent.click(screen.getByLabelText('Reset view'));

    expect(resetViewSpy).toHaveBeenCalled();
  });

  it('adds transition duration when zooming', () => {
    render(<ZoomControls />);

    fireEvent.click(screen.getByLabelText('Zoom in'));

    const { transitionDuration } = useFlightMapViewStore.getState().viewState;
    expect(transitionDuration).toBe(300);
  });
});
