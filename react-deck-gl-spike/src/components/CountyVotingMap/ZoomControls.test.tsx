import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { ZoomControls } from './ZoomControls';
import {
  useCountyVotingViewStore,
  US_VIEW_BOUNDS,
  US_INITIAL_VIEW_STATE,
} from '../../stores/countyVotingViewStore';

describe('ZoomControls', () => {
  beforeEach(() => {
    act(() => {
      useCountyVotingViewStore.getState().reset();
    });
  });

  it('renders zoom in button', () => {
    render(<ZoomControls />);

    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
  });

  it('renders zoom out button', () => {
    render(<ZoomControls />);

    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
  });

  it('renders reset view button', () => {
    render(<ZoomControls />);

    expect(screen.getByLabelText('Reset view')).toBeInTheDocument();
  });

  it('has correct role and aria-label for control group', () => {
    render(<ZoomControls />);

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Map zoom controls');
  });

  describe('zoom in button', () => {
    it('calls zoomIn when clicked', () => {
      render(<ZoomControls />);

      const initialZoom = useCountyVotingViewStore.getState().viewState.zoom;

      fireEvent.click(screen.getByLabelText('Zoom in'));

      const newZoom = useCountyVotingViewStore.getState().viewState.zoom;
      expect(newZoom).toBe(initialZoom + 1);
    });

    it('is disabled when at max zoom', () => {
      act(() => {
        useCountyVotingViewStore.getState().setViewState({
          ...US_INITIAL_VIEW_STATE,
          zoom: US_VIEW_BOUNDS.maxZoom,
        });
      });

      render(<ZoomControls />);

      expect(screen.getByLabelText('Zoom in')).toBeDisabled();
    });

    it('is enabled when below max zoom', () => {
      render(<ZoomControls />);

      expect(screen.getByLabelText('Zoom in')).not.toBeDisabled();
    });
  });

  describe('zoom out button', () => {
    it('calls zoomOut when clicked', () => {
      render(<ZoomControls />);

      const initialZoom = useCountyVotingViewStore.getState().viewState.zoom;

      fireEvent.click(screen.getByLabelText('Zoom out'));

      const newZoom = useCountyVotingViewStore.getState().viewState.zoom;
      expect(newZoom).toBe(initialZoom - 1);
    });

    it('is disabled when at min zoom', () => {
      act(() => {
        useCountyVotingViewStore.getState().setViewState({
          ...US_INITIAL_VIEW_STATE,
          zoom: US_VIEW_BOUNDS.minZoom,
        });
      });

      render(<ZoomControls />);

      expect(screen.getByLabelText('Zoom out')).toBeDisabled();
    });

    it('is enabled when above min zoom', () => {
      render(<ZoomControls />);

      expect(screen.getByLabelText('Zoom out')).not.toBeDisabled();
    });
  });

  describe('reset view button', () => {
    it('calls resetView when clicked', () => {
      // First change the view state
      act(() => {
        useCountyVotingViewStore.getState().setViewState({
          longitude: -80,
          latitude: 30,
          zoom: 8,
          pitch: 0,
          bearing: 0,
        });
      });

      render(<ZoomControls />);

      fireEvent.click(screen.getByLabelText('Reset view'));

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState).toEqual(US_INITIAL_VIEW_STATE);
    });

    it('is always enabled', () => {
      render(<ZoomControls />);

      expect(screen.getByLabelText('Reset view')).not.toBeDisabled();
    });
  });

  it('applies correct styling classes', () => {
    render(<ZoomControls />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveClass('bg-gray-900/80');
      expect(button).toHaveClass('backdrop-blur-md');
      expect(button).toHaveClass('rounded-lg');
    });
  });

  it('displays correct button content', () => {
    render(<ZoomControls />);

    expect(screen.getByLabelText('Zoom in')).toHaveTextContent('+');
    expect(screen.getByLabelText('Zoom out')).toHaveTextContent('−');
    expect(screen.getByLabelText('Reset view')).toHaveTextContent('⌂');
  });
});
