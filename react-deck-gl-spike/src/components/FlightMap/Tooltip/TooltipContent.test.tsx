import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TooltipContent } from './TooltipContent';
import type { FlightRoute } from '../../../types/flight';

const mockRoute: FlightRoute = {
  id: 'route-1',
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
  frequency: 42,
};

describe('TooltipContent', () => {
  it('renders origin airport code', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(screen.getByText('LAX')).toBeInTheDocument();
  });

  it('renders destination airport code', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(screen.getByText('JFK')).toBeInTheDocument();
  });

  it('renders origin airport name', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(
      screen.getByText('Los Angeles International Airport')
    ).toBeInTheDocument();
  });

  it('renders destination airport name', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(
      screen.getByText('John F. Kennedy International Airport')
    ).toBeInTheDocument();
  });

  it('renders origin city and country', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(screen.getByText('Los Angeles, USA')).toBeInTheDocument();
  });

  it('renders destination city and country', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(screen.getByText('New York, USA')).toBeInTheDocument();
  });

  it('renders frequency', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('flights/week')).toBeInTheDocument();
  });

  it('renders distance when provided', () => {
    const routeWithDistance: FlightRoute = {
      ...mockRoute,
      distance: 3983,
    };

    render(<TooltipContent route={routeWithDistance} />);

    expect(screen.getByText('3,983 km')).toBeInTheDocument();
  });

  it('does not render distance when not provided', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(screen.queryByText(/km$/)).not.toBeInTheDocument();
  });

  it('renders passenger volume when provided', () => {
    const routeWithPassengers: FlightRoute = {
      ...mockRoute,
      passengerVolume: 5000000,
    };

    render(<TooltipContent route={routeWithPassengers} />);

    expect(screen.getByText('5,000,000')).toBeInTheDocument();
    expect(screen.getByText('Annual Passengers')).toBeInTheDocument();
  });

  it('does not render passenger volume when not provided', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(screen.queryByText('Annual Passengers')).not.toBeInTheDocument();
  });

  it('renders airline when provided', () => {
    const routeWithAirline: FlightRoute = {
      ...mockRoute,
      airline: 'Delta',
    };

    render(<TooltipContent route={routeWithAirline} />);

    expect(screen.getByText('Delta')).toBeInTheDocument();
    expect(screen.getByText('Airline')).toBeInTheDocument();
  });

  it('does not render airline when not provided', () => {
    render(<TooltipContent route={mockRoute} />);

    expect(screen.queryByText('Airline')).not.toBeInTheDocument();
  });

  it('renders all optional fields when provided', () => {
    const fullRoute: FlightRoute = {
      ...mockRoute,
      distance: 3983,
      passengerVolume: 5000000,
      airline: 'Delta',
    };

    render(<TooltipContent route={fullRoute} />);

    expect(screen.getByText('3,983 km')).toBeInTheDocument();
    expect(screen.getByText('5,000,000')).toBeInTheDocument();
    expect(screen.getByText('Delta')).toBeInTheDocument();
  });
});
