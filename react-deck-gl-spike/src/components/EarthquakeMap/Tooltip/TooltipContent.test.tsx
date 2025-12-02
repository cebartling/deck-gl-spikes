import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TooltipContent } from './TooltipContent';
import type { Earthquake } from '../../../types/earthquake';

describe('TooltipContent', () => {
  const mockEarthquake: Earthquake = {
    id: '1',
    longitude: -122.4194,
    latitude: 37.7749,
    depth: 10,
    magnitude: 5.5,
    timestamp: '2024-01-15T10:30:00Z',
    location: 'San Francisco, CA',
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders magnitude value', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    expect(screen.getByTestId('magnitude-value')).toHaveTextContent('M5.5');
  });

  it('renders magnitude descriptor', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    expect(screen.getByTestId('magnitude-descriptor')).toHaveTextContent('Strong');
  });

  it('renders location', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    expect(screen.getByTestId('location')).toHaveTextContent('San Francisco, CA');
  });

  it('renders coordinates', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    const coordinates = screen.getByTestId('coordinates');
    expect(coordinates).toHaveTextContent('37.775°N');
    expect(coordinates).toHaveTextContent('122.419°W');
  });

  it('renders depth with classification', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    const depthInfo = screen.getByTestId('depth-info');
    expect(depthInfo).toHaveTextContent('10.0 km');
    expect(depthInfo).toHaveTextContent('Shallow');
  });

  it('renders date', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    expect(screen.getByTestId('date-info')).toBeInTheDocument();
  });

  it('renders time', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    expect(screen.getByTestId('time-info')).toBeInTheDocument();
  });

  it('renders relative time when available', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    // Event is 1.5 hours ago from mock system time
    expect(screen.getByTestId('time-info')).toHaveTextContent('1 hours ago');
  });

  it('renders depth color indicator', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    expect(screen.getByTestId('depth-color-indicator')).toBeInTheDocument();
  });

  it('depth color indicator has correct background color', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    const indicator = screen.getByTestId('depth-color-indicator');
    // Shallow depth (10km) should be close to yellow
    expect(indicator).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });
  });

  it('renders correct descriptor for minor earthquake', () => {
    const minorQuake: Earthquake = {
      ...mockEarthquake,
      magnitude: 2.5,
    };

    render(<TooltipContent earthquake={minorQuake} />);

    expect(screen.getByTestId('magnitude-descriptor')).toHaveTextContent('Minor');
  });

  it('renders correct descriptor for great earthquake', () => {
    const greatQuake: Earthquake = {
      ...mockEarthquake,
      magnitude: 8.0,
    };

    render(<TooltipContent earthquake={greatQuake} />);

    expect(screen.getByTestId('magnitude-descriptor')).toHaveTextContent('Great');
  });

  it('renders intermediate depth classification', () => {
    const intermediateQuake: Earthquake = {
      ...mockEarthquake,
      depth: 150,
    };

    render(<TooltipContent earthquake={intermediateQuake} />);

    expect(screen.getByTestId('depth-info')).toHaveTextContent('Intermediate');
  });

  it('renders deep depth classification', () => {
    const deepQuake: Earthquake = {
      ...mockEarthquake,
      depth: 500,
    };

    render(<TooltipContent earthquake={deepQuake} />);

    expect(screen.getByTestId('depth-info')).toHaveTextContent('Deep');
  });

  it('renders southern hemisphere coordinates correctly', () => {
    const southernQuake: Earthquake = {
      ...mockEarthquake,
      longitude: 151.2093,
      latitude: -33.8688,
      location: 'Sydney, Australia',
    };

    render(<TooltipContent earthquake={southernQuake} />);

    const coordinates = screen.getByTestId('coordinates');
    expect(coordinates).toHaveTextContent('33.869°S');
    expect(coordinates).toHaveTextContent('151.209°E');
  });

  it('has tooltip-content data-testid', () => {
    render(<TooltipContent earthquake={mockEarthquake} />);

    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
  });
});
