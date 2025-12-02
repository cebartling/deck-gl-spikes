import { describe, it, expect } from 'vitest';
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
    // Offset is 10px for both x and y
    expect(tooltip).toHaveStyle({ left: '110px', top: '210px' });
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

  it('has aria-live polite for accessibility', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute('aria-live', 'polite');
  });

  it('includes screen reader only text', () => {
    render(<EarthquakeTooltip earthquake={mockEarthquake} x={100} y={200} />);

    expect(screen.getByText('Earthquake details:')).toHaveClass('sr-only');
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
});
