import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CountyTooltip } from './CountyTooltip';
import type { CountyVoting } from '../../../types/county';

describe('CountyTooltip', () => {
  const mockCounty: CountyVoting = {
    fips: '06001',
    name: 'Alameda',
    state: 'CA',
    stateFips: '06',
    totalVotes: 500000,
    democratVotes: 350000,
    republicanVotes: 130000,
    otherVotes: 20000,
    margin: 220000,
    marginPercent: 44,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders tooltip when county is provided', () => {
    render(<CountyTooltip county={mockCounty} x={100} y={100} />);
    expect(screen.getByTestId('county-tooltip')).toBeInTheDocument();
  });

  it('does not render when county is null', () => {
    render(<CountyTooltip county={null} x={100} y={100} />);
    expect(screen.queryByTestId('county-tooltip')).not.toBeInTheDocument();
  });

  it('positions tooltip with offset from cursor', () => {
    render(<CountyTooltip county={mockCounty} x={100} y={100} />);
    const tooltip = screen.getByTestId('county-tooltip');
    expect(tooltip).toHaveStyle({ left: '115px', top: '90px' });
  });

  it('has accessible role and aria-label', () => {
    render(<CountyTooltip county={mockCounty} x={100} y={100} />);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute(
      'aria-label',
      'Alameda, CA: Democrat +44.0%'
    );
  });

  it('fades out when county becomes null', () => {
    const { rerender } = render(
      <CountyTooltip county={mockCounty} x={100} y={100} />
    );

    expect(screen.getByTestId('county-tooltip')).toHaveClass('opacity-100');

    rerender(<CountyTooltip county={null} x={100} y={100} />);

    // Should start fade out
    expect(screen.getByTestId('county-tooltip')).toHaveClass('opacity-0');
  });

  it('removes tooltip after transition completes', () => {
    const { rerender } = render(
      <CountyTooltip county={mockCounty} x={100} y={100} />
    );

    rerender(<CountyTooltip county={null} x={100} y={100} />);

    // After transition duration, tooltip should be removed
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByTestId('county-tooltip')).not.toBeInTheDocument();
  });

  it('updates position when county changes', () => {
    const { rerender } = render(
      <CountyTooltip county={mockCounty} x={100} y={100} />
    );

    const tooltip1 = screen.getByTestId('county-tooltip');
    expect(tooltip1).toHaveStyle({ left: '115px', top: '90px' });

    rerender(<CountyTooltip county={mockCounty} x={200} y={200} />);

    const tooltip2 = screen.getByTestId('county-tooltip');
    expect(tooltip2).toHaveStyle({ left: '215px', top: '190px' });
  });

  it('respects visible prop', () => {
    render(<CountyTooltip county={mockCounty} x={100} y={100} visible={false} />);

    // Should start fade out immediately when visible is false
    vi.advanceTimersByTime(200);

    expect(screen.queryByTestId('county-tooltip')).not.toBeInTheDocument();
  });

  it('includes screen reader content', () => {
    render(<CountyTooltip county={mockCounty} x={100} y={100} />);

    const srContent = screen.getByText(/Alameda, CA/);
    expect(srContent).toHaveClass('sr-only');
  });
});
