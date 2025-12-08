import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlightTooltip } from './FlightTooltip';
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

describe('FlightTooltip', () => {
  beforeEach(() => {
    // Set up a standard viewport size
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1920);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1080);
  });

  it('renders TooltipContent with route data', () => {
    render(<FlightTooltip route={mockRoute} x={100} y={200} />);

    expect(screen.getByText('LAX')).toBeInTheDocument();
    expect(screen.getByText('JFK')).toBeInTheDocument();
  });

  it('renders tooltip at correct position', () => {
    const { container } = render(
      <FlightTooltip route={mockRoute} x={100} y={200} />
    );

    const tooltip = container.firstChild as HTMLElement;
    expect(tooltip).toHaveStyle({
      left: '115px', // 100 + 15 (OFFSET)
      top: '215px', // 200 + 15 (OFFSET)
    });
  });

  it('has correct CSS classes', () => {
    const { container } = render(
      <FlightTooltip route={mockRoute} x={100} y={200} />
    );

    const tooltip = container.firstChild as HTMLElement;
    expect(tooltip).toHaveClass('absolute', 'pointer-events-none', 'z-50');
  });

  it('tooltip has animation class', () => {
    const { container } = render(
      <FlightTooltip route={mockRoute} x={100} y={200} />
    );

    const tooltipContent = container.querySelector('.animate-fade-in');
    expect(tooltipContent).toBeInTheDocument();
  });

  it('flips horizontal position when near right edge', () => {
    const { container } = render(
      <FlightTooltip route={mockRoute} x={1800} y={200} />
    );

    const tooltip = container.firstChild as HTMLElement;
    // Should flip to left side: 1800 - 280 (TOOLTIP_WIDTH) - 15 (OFFSET) = 1505
    expect(tooltip).toHaveStyle({
      left: '1505px',
    });
  });

  it('flips vertical position when near bottom edge', () => {
    const { container } = render(
      <FlightTooltip route={mockRoute} x={100} y={900} />
    );

    const tooltip = container.firstChild as HTMLElement;
    // Should flip to top: 900 - 250 (TOOLTIP_HEIGHT) - 15 (OFFSET) = 635
    expect(tooltip).toHaveStyle({
      top: '635px',
    });
  });

  it('flips both positions when near bottom-right corner', () => {
    const { container } = render(
      <FlightTooltip route={mockRoute} x={1800} y={900} />
    );

    const tooltip = container.firstChild as HTMLElement;
    expect(tooltip).toHaveStyle({
      left: '1505px',
      top: '635px',
    });
  });

  it('respects minimum viewport padding', () => {
    // Position near top-left corner
    const { container } = render(
      <FlightTooltip route={mockRoute} x={-100} y={-100} />
    );

    const tooltip = container.firstChild as HTMLElement;
    // Should be at minimum padding of 10px
    expect(tooltip).toHaveStyle({
      left: '10px',
      top: '10px',
    });
  });

  it('tooltip stays within viewport bounds on small screen', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(400);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600);

    const { container } = render(
      <FlightTooltip route={mockRoute} x={300} y={400} />
    );

    const tooltip = container.firstChild as HTMLElement;
    // Should flip to stay on screen
    expect(tooltip).toHaveStyle({
      left: '10px', // Clamped to minimum padding
      top: '135px', // 400 - 250 - 15 = 135
    });
  });
});
