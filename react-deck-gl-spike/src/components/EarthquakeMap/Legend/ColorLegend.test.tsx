import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ColorLegend } from './ColorLegend';

describe('ColorLegend', () => {
  it('renders the legend container', () => {
    render(<ColorLegend />);

    expect(screen.getByText('Depth')).toBeInTheDocument();
  });

  it('renders gradient bar', () => {
    const { container } = render(<ColorLegend />);

    const gradientBar = container.querySelector('[role="img"]');
    expect(gradientBar).toBeInTheDocument();
    expect(gradientBar).toHaveStyle({
      background:
        'linear-gradient(to right, #FFFF00, #FFC800, #FF8C00, #FF4500, #FF0000, #8B0000)',
    });
  });

  it('displays "Shallow" and "Deep" labels', () => {
    render(<ColorLegend />);

    expect(screen.getByText('Shallow')).toBeInTheDocument();
    expect(screen.getByText('Deep')).toBeInTheDocument();
  });

  it('displays depth range labels', () => {
    render(<ColorLegend />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('700 km')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<ColorLegend />);

    const legendContainer = container.querySelector('.absolute.bottom-4.right-4');
    expect(legendContainer).toBeInTheDocument();
    expect(legendContainer).toHaveClass('bg-gray-900/80', 'backdrop-blur-md', 'rounded-lg', 'shadow-lg', 'border-white/10');
  });

  it('has accessible role and aria-labelledby', () => {
    render(<ColorLegend />);

    const region = screen.getByRole('region');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-labelledby', 'color-legend-title');
  });

  it('gradient bar has accessible aria-label', () => {
    render(<ColorLegend />);

    const gradientBar = screen.getByRole('img');
    expect(gradientBar).toHaveAttribute(
      'aria-label',
      'Color gradient from yellow (shallow) to dark red (deep)'
    );
  });
});
