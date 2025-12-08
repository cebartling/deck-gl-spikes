import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AirportSelector } from './AirportSelector';
import { useFlightFilterStore } from '../../../stores/flightFilterStore';
import { useFlightMapViewStore } from '../../../stores/flightMapViewStore';
import type { Airport } from '../../../types/flight';

const mockAirports: Airport[] = [
  {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'USA',
    longitude: -118.4085,
    latitude: 33.9425,
  },
  {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'USA',
    longitude: -73.7781,
    latitude: 40.6413,
  },
];

describe('AirportSelector', () => {
  beforeEach(() => {
    useFlightFilterStore.getState().reset();
    useFlightMapViewStore.getState().reset();
  });

  it('renders search input', () => {
    render(<AirportSelector airports={mockAirports} />);

    expect(
      screen.getByPlaceholderText('Search airports...')
    ).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<AirportSelector airports={mockAirports} />);

    expect(screen.getByText('Filter by Airport')).toBeInTheDocument();
  });

  it('dropdown opens on focus', () => {
    render(<AirportSelector airports={mockAirports} />);

    const input = screen.getByPlaceholderText('Search airports...');
    fireEvent.focus(input);

    expect(screen.getByText('All Airports')).toBeInTheDocument();
  });

  it('dropdown shows search results', () => {
    render(<AirportSelector airports={mockAirports} />);

    const input = screen.getByPlaceholderText('Search airports...');
    fireEvent.focus(input);

    expect(screen.getByText('LAX')).toBeInTheDocument();
    expect(screen.getByText('JFK')).toBeInTheDocument();
  });

  it('selecting airport updates store', () => {
    render(<AirportSelector airports={mockAirports} />);

    const input = screen.getByPlaceholderText('Search airports...');
    fireEvent.focus(input);

    // Find and click on LAX option
    const laxOption = screen.getByText('Los Angeles International Airport');
    fireEvent.click(laxOption);

    expect(useFlightFilterStore.getState().selectedAirport).toBe('LAX');
  });

  it('selecting airport triggers flyTo', () => {
    const flyToSpy = vi.spyOn(useFlightMapViewStore.getState(), 'flyTo');

    render(<AirportSelector airports={mockAirports} />);

    const input = screen.getByPlaceholderText('Search airports...');
    fireEvent.focus(input);

    const laxOption = screen.getByText('Los Angeles International Airport');
    fireEvent.click(laxOption);

    expect(flyToSpy).toHaveBeenCalledWith({
      longitude: -118.4085,
      latitude: 33.9425,
      zoom: 6,
    });
  });

  it('clear button clears filter', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');

    render(<AirportSelector airports={mockAirports} />);

    const clearButton = screen.getByLabelText('Clear filter');
    fireEvent.click(clearButton);

    expect(useFlightFilterStore.getState().selectedAirport).toBeNull();
  });

  it('"All Airports" option clears filter', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');

    render(<AirportSelector airports={mockAirports} />);

    const input = screen.getByPlaceholderText('Search airports...');
    fireEvent.focus(input);

    const allAirportsOption = screen.getByText('All Airports');
    fireEvent.click(allAirportsOption);

    expect(useFlightFilterStore.getState().selectedAirport).toBeNull();
  });

  it('displays selected airport badge', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');

    render(<AirportSelector airports={mockAirports} />);

    expect(screen.getByText('LAX')).toBeInTheDocument();
  });

  it('shows selected airport name in input when not focused', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');

    render(<AirportSelector airports={mockAirports} />);

    const input = screen.getByPlaceholderText(
      'Search airports...'
    ) as HTMLInputElement;
    expect(input.value).toBe('Los Angeles International Airport');
  });
});
