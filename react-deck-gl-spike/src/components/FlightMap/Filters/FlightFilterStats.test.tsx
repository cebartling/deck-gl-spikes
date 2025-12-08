import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlightFilterStats } from './FlightFilterStats';
import type { FilteredRoutesStats } from '../../../types/flightFilter';
import type { Airport } from '../../../types/flight';

const mockStats: FilteredRoutesStats = {
  totalRoutes: 25,
  totalFlights: 1250,
  connectedAirports: 15,
};

const mockAirport: Airport = {
  code: 'LAX',
  name: 'Los Angeles International Airport',
  city: 'Los Angeles',
  country: 'USA',
  longitude: -118.4085,
  latitude: 33.9425,
};

describe('FlightFilterStats', () => {
  it('renders "Network Summary" when not filtered', () => {
    render(
      <FlightFilterStats
        stats={mockStats}
        selectedAirport={null}
        isFiltered={false}
      />
    );

    expect(screen.getByText('Network Summary')).toBeInTheDocument();
  });

  it('renders airport code and city when filtered', () => {
    render(
      <FlightFilterStats
        stats={mockStats}
        selectedAirport={mockAirport}
        isFiltered={true}
      />
    );

    expect(screen.getByText('LAX - Los Angeles')).toBeInTheDocument();
  });

  it('renders routes count', () => {
    render(
      <FlightFilterStats
        stats={mockStats}
        selectedAirport={null}
        isFiltered={false}
      />
    );

    expect(screen.getByText('Routes')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders weekly flights count', () => {
    render(
      <FlightFilterStats
        stats={mockStats}
        selectedAirport={null}
        isFiltered={false}
      />
    );

    expect(screen.getByText('Weekly Flights')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
  });

  it('renders connected airports count', () => {
    render(
      <FlightFilterStats
        stats={mockStats}
        selectedAirport={null}
        isFiltered={false}
      />
    );

    expect(screen.getByText('Connected Airports')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('formats large numbers with commas', () => {
    const largeStats: FilteredRoutesStats = {
      totalRoutes: 1500,
      totalFlights: 125000,
      connectedAirports: 150,
    };

    render(
      <FlightFilterStats
        stats={largeStats}
        selectedAirport={null}
        isFiltered={false}
      />
    );

    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(screen.getByText('125,000')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('renders zero values correctly', () => {
    const emptyStats: FilteredRoutesStats = {
      totalRoutes: 0,
      totalFlights: 0,
      connectedAirports: 0,
    };

    render(
      <FlightFilterStats
        stats={emptyStats}
        selectedAirport={null}
        isFiltered={false}
      />
    );

    const zeroValues = screen.getAllByText('0');
    expect(zeroValues).toHaveLength(3);
  });
});
