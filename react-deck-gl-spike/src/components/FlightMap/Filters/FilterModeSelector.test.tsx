import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterModeSelector } from './FilterModeSelector';
import { useFlightFilterStore } from '../../../stores/flightFilterStore';

describe('FilterModeSelector', () => {
  beforeEach(() => {
    useFlightFilterStore.getState().reset();
  });

  it('renders only when airport is selected', () => {
    const { container } = render(<FilterModeSelector />);

    // Should render nothing when no airport is selected
    expect(container.firstChild).toBeNull();
  });

  it('renders all three mode buttons when airport selected', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');

    render(<FilterModeSelector />);

    expect(screen.getByText('All Routes')).toBeInTheDocument();
    expect(screen.getByText('Departures')).toBeInTheDocument();
    expect(screen.getByText('Arrivals')).toBeInTheDocument();
  });

  it('renders label', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');

    render(<FilterModeSelector />);

    expect(screen.getByText('Show Routes')).toBeInTheDocument();
  });

  it('clicking mode button updates store', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');

    render(<FilterModeSelector />);

    fireEvent.click(screen.getByText('Departures'));
    expect(useFlightFilterStore.getState().filterMode).toBe('origin');

    fireEvent.click(screen.getByText('Arrivals'));
    expect(useFlightFilterStore.getState().filterMode).toBe('destination');

    fireEvent.click(screen.getByText('All Routes'));
    expect(useFlightFilterStore.getState().filterMode).toBe('both');
  });

  it('selected mode has active styling', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');
    useFlightFilterStore.getState().setFilterMode('origin');

    render(<FilterModeSelector />);

    const departuresButton = screen.getByText('Departures');
    expect(departuresButton).toHaveClass('bg-cyan-600');

    const allRoutesButton = screen.getByText('All Routes');
    expect(allRoutesButton).toHaveClass('bg-gray-700');
  });

  it('default mode is "both"', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');

    render(<FilterModeSelector />);

    const allRoutesButton = screen.getByText('All Routes');
    expect(allRoutesButton).toHaveClass('bg-cyan-600');
  });
});
