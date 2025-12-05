import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EarthquakeStats } from './EarthquakeStats';

describe('EarthquakeStats', () => {
  it('renders filtered count', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={50} isFiltered={false} />
    );

    expect(screen.getByTestId('filtered-count')).toHaveTextContent('50');
  });

  it('renders "earthquake" singular when count is 1', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={1} isFiltered={false} />
    );

    expect(screen.getByText('earthquake')).toBeInTheDocument();
    expect(screen.queryByText('earthquakes')).not.toBeInTheDocument();
  });

  it('renders "earthquakes" plural when count is not 1', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={50} isFiltered={false} />
    );

    expect(screen.getByText('earthquakes')).toBeInTheDocument();
  });

  it('renders "earthquakes" plural when count is 0', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={0} isFiltered={true} />
    );

    expect(screen.getByText('earthquakes')).toBeInTheDocument();
  });

  it('shows total count when filtered', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={50} isFiltered={true} />
    );

    expect(screen.getByTestId('total-count')).toHaveTextContent('of 100');
  });

  it('hides total count when not filtered', () => {
    render(
      <EarthquakeStats
        totalCount={100}
        filteredCount={100}
        isFiltered={false}
      />
    );

    expect(screen.queryByTestId('total-count')).not.toBeInTheDocument();
  });

  it('shows filter indicator when isFiltered is true', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={50} isFiltered={true} />
    );

    expect(screen.getByTestId('filter-indicator')).toBeInTheDocument();
    expect(screen.getByText('Filter active')).toBeInTheDocument();
  });

  it('hides filter indicator when isFiltered is false', () => {
    render(
      <EarthquakeStats
        totalCount={100}
        filteredCount={100}
        isFiltered={false}
      />
    );

    expect(screen.queryByTestId('filter-indicator')).not.toBeInTheDocument();
    expect(screen.queryByText('Filter active')).not.toBeInTheDocument();
  });

  it('has status role for accessibility', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={50} isFiltered={false} />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live polite for screen readers', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={50} isFiltered={false} />
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('has screen reader text with full details', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={50} isFiltered={true} />
    );

    const srText = screen.getByText(/Showing 50 of 100 earthquakes/);
    expect(srText).toHaveClass('sr-only');
  });

  it('has data-testid for testing', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={50} isFiltered={false} />
    );

    expect(screen.getByTestId('earthquake-stats')).toBeInTheDocument();
  });

  it('formats large numbers with locale string', () => {
    render(
      <EarthquakeStats
        totalCount={10000}
        filteredCount={5000}
        isFiltered={true}
      />
    );

    // Numbers should be formatted with locale string (e.g., "5,000")
    expect(screen.getByTestId('filtered-count').textContent).toBe('5,000');
    expect(screen.getByTestId('total-count').textContent).toContain('10,000');
  });

  it('has dark glassmorphism styling', () => {
    render(
      <EarthquakeStats totalCount={100} filteredCount={50} isFiltered={false} />
    );

    const stats = screen.getByTestId('earthquake-stats');
    expect(stats).toHaveClass('bg-gray-900/80');
    expect(stats).toHaveClass('backdrop-blur-md');
    expect(stats).toHaveClass('rounded-lg');
    expect(stats).toHaveClass('shadow-lg');
    expect(stats).toHaveClass('border-white/10');
  });
});
