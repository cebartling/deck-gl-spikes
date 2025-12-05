import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterStats } from './FilterStats';
import type { FilterStats as FilterStatsType } from '../hooks/useFilteredCounties';

function createMockStats(
  overrides: Partial<FilterStatsType> = {}
): FilterStatsType {
  return {
    countyCount: 100,
    totalVotes: 1000000,
    democratVotes: 520000,
    republicanVotes: 480000,
    overallMargin: 4,
    ...overrides,
  };
}

describe('FilterStats', () => {
  describe('rendering', () => {
    it('should return null when stats is null', () => {
      const { container } = render(
        <FilterStats
          stats={null}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render the component when stats are provided', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('National Summary')).toBeInTheDocument();
    });
  });

  describe('header', () => {
    it('should display "National Summary" when not filtered', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('National Summary')).toBeInTheDocument();
    });

    it('should display state name when filtered', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={true}
          stateName="California"
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('California Summary')).toBeInTheDocument();
    });
  });

  describe('election year info', () => {
    it('should display candidate description for 2024', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('Harris vs Trump')).toBeInTheDocument();
    });

    it('should display candidate description for 2020', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2020}
        />
      );
      expect(screen.getByText('Biden vs Trump')).toBeInTheDocument();
    });

    it('should display candidate description for 2016', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2016}
        />
      );
      expect(screen.getByText('Clinton vs Trump')).toBeInTheDocument();
    });

    it('should display candidate description for 2012', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2012}
        />
      );
      expect(screen.getByText('Obama vs Romney')).toBeInTheDocument();
    });

    it('should display candidate description for 2008', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2008}
        />
      );
      expect(screen.getByText('Obama vs McCain')).toBeInTheDocument();
    });

    it('should display midterm description for 2022', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="midterm"
          year={2022}
        />
      );
      expect(screen.getByText('House & Senate')).toBeInTheDocument();
    });

    it('should display midterm description for 2018', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="midterm"
          year={2018}
        />
      );
      expect(screen.getByText('House & Senate')).toBeInTheDocument();
    });
  });

  describe('county count', () => {
    it('should display formatted county count', () => {
      render(
        <FilterStats
          stats={createMockStats({ countyCount: 3143 })}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('3,143')).toBeInTheDocument();
    });

    it('should display county count label', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('Counties')).toBeInTheDocument();
    });
  });

  describe('vote totals', () => {
    it('should display formatted total votes', () => {
      render(
        <FilterStats
          stats={createMockStats({ totalVotes: 150000000 })}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('150,000,000')).toBeInTheDocument();
    });

    it('should display formatted Democrat votes', () => {
      render(
        <FilterStats
          stats={createMockStats({ democratVotes: 81000000 })}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('81,000,000')).toBeInTheDocument();
    });

    it('should display formatted Republican votes', () => {
      render(
        <FilterStats
          stats={createMockStats({ republicanVotes: 74000000 })}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('74,000,000')).toBeInTheDocument();
    });

    it('should display vote labels', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('Total Votes')).toBeInTheDocument();
      expect(screen.getByText('Democrat')).toBeInTheDocument();
      expect(screen.getByText('Republican')).toBeInTheDocument();
    });
  });

  describe('overall margin', () => {
    it('should display Democrat winner with positive margin', () => {
      render(
        <FilterStats
          stats={createMockStats({ overallMargin: 4.5 })}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText(/Democrat.*\+4\.5%/)).toBeInTheDocument();
    });

    it('should display Republican winner with negative margin', () => {
      render(
        <FilterStats
          stats={createMockStats({ overallMargin: -3.2 })}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText(/Republican.*3\.2%/)).toBeInTheDocument();
    });

    it('should not display margin when total votes is zero', () => {
      render(
        <FilterStats
          stats={createMockStats({ totalVotes: 0 })}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.queryByText('Overall Margin')).not.toBeInTheDocument();
    });

    it('should display margin label when there are votes', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      expect(screen.getByText('Overall Margin')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply blue color for Democrat votes', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      const democratLabel = screen.getByText('Democrat');
      expect(democratLabel).toHaveClass('text-blue-400');
    });

    it('should apply red color for Republican votes', () => {
      render(
        <FilterStats
          stats={createMockStats()}
          isFiltered={false}
          electionType="presidential"
          year={2024}
        />
      );
      const republicanLabel = screen.getByText('Republican');
      expect(republicanLabel).toHaveClass('text-red-400');
    });
  });
});
