import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SizeLegend } from './SizeLegend';

describe('SizeLegend', () => {
  it('renders the legend container', () => {
    render(<SizeLegend />);

    expect(screen.getByText('Magnitude')).toBeInTheDocument();
  });

  it('renders all magnitude samples', () => {
    render(<SizeLegend />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('displays correct magnitude labels', () => {
    render(<SizeLegend />);

    const labels = screen.getAllByText(/^[3579]$/);
    expect(labels).toHaveLength(4);
  });

  it('renders circles for each magnitude', () => {
    const { container } = render(<SizeLegend />);

    const circles = container.querySelectorAll('.rounded-full');
    expect(circles).toHaveLength(4);
  });

  it('circle sizes increase with magnitude', () => {
    const { container } = render(<SizeLegend />);

    const circles = container.querySelectorAll('.rounded-full');
    const sizes = Array.from(circles).map((circle) => {
      const style = (circle as HTMLElement).style;
      return parseInt(style.width, 10);
    });

    // Verify sizes are in ascending order
    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i]).toBeGreaterThan(sizes[i - 1]);
    }
  });

  it('applies correct styling classes', () => {
    const { container } = render(<SizeLegend />);

    const legendContainer = container.querySelector('.absolute.bottom-24.left-4');
    expect(legendContainer).toBeInTheDocument();
    expect(legendContainer).toHaveClass('bg-gray-900/80', 'backdrop-blur-md', 'rounded-lg', 'shadow-lg', 'border-white/10');
  });

  it('circles have orange color styling', () => {
    const { container } = render(<SizeLegend />);

    const circles = container.querySelectorAll('.rounded-full');
    circles.forEach((circle) => {
      expect(circle).toHaveClass('bg-orange-500/60', 'border-orange-600');
    });
  });
});
