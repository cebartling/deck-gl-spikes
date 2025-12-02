import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EarthquakeTooltip } from './EarthquakeTooltip';
import type { Earthquake } from '../../../types/earthquake';

describe('EarthquakeTooltip', () => {
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
    vi.setSystemTime(new Date('2024-01-02T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders earthquake magnitude', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    expect(screen.getByText('M4.5')).toBeInTheDocument();
  });

  it('renders earthquake location', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  it('formats magnitude to one decimal place', () => {
    const earthquake: Earthquake = {
      ...mockEarthquake,
      magnitude: 6.789,
    };

    render(<EarthquakeTooltip earthquake={earthquake} x={100} y={200} />);

    expect(screen.getByText('M6.8')).toBeInTheDocument();
  });

  it('positions at correct x, y coordinates with offset', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    const tooltip = screen.getByRole('tooltip');
    // Offset is 15px for x and -10px for y
    expect(tooltip).toHaveStyle({ left: '115px', top: '190px' });
  });

  it('has pointer-events-none class', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('pointer-events-none');
  });

  it('has tooltip ARIA role', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('has aria-label for accessibility', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute('aria-label', 'Earthquake details: Magnitude 4.5');
  });

  it('includes screen reader only text with full details', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    const srText = screen.getByText(/Magnitude 4.5 Moderate earthquake/);
    expect(srText).toHaveClass('sr-only');
    expect(srText).toHaveTextContent('San Francisco, CA');
    expect(srText).toHaveTextContent('10.0 km');
  });

  it('has correct z-index for overlay', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('z-50');
  });

  it('has data-testid for testing', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    expect(screen.getByTestId('earthquake-tooltip')).toBeInTheDocument();
  });

  it('renders TooltipContent component', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
  });

  it('has min-width and max-width constraints', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('min-w-[200px]');
    expect(tooltip).toHaveClass('max-w-[300px]');
  });

  it('has backdrop blur effect', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('backdrop-blur-sm');
  });
});
