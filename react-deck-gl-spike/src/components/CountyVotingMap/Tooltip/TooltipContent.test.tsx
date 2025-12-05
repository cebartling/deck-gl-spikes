import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TooltipContent } from './TooltipContent';
import type { CountyVoting } from '../../../types/county';

describe('TooltipContent', () => {
  const mockDemocratCounty: CountyVoting = {
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

  const mockRepublicanCounty: CountyVoting = {
    fips: '48201',
    name: 'Harris',
    state: 'TX',
    stateFips: '48',
    totalVotes: 1500000,
    democratVotes: 700000,
    republicanVotes: 780000,
    otherVotes: 20000,
    margin: -80000,
    marginPercent: -5.3,
  };

  const mockNoOtherVotes: CountyVoting = {
    ...mockDemocratCounty,
    otherVotes: 0,
    totalVotes: 480000,
  };

  it('renders county name', () => {
    render(<TooltipContent county={mockDemocratCounty} />);
    expect(screen.getByTestId('county-name')).toHaveTextContent('Alameda');
  });

  it('renders state abbreviation', () => {
    render(<TooltipContent county={mockDemocratCounty} />);
    expect(screen.getByTestId('county-state')).toHaveTextContent('CA');
  });

  it('renders Democrat vote count formatted', () => {
    render(<TooltipContent county={mockDemocratCounty} />);
    expect(screen.getByTestId('democrat-votes')).toHaveTextContent('350,000');
  });

  it('renders Republican vote count formatted', () => {
    render(<TooltipContent county={mockDemocratCounty} />);
    expect(screen.getByTestId('republican-votes')).toHaveTextContent('130,000');
  });

  it('renders other votes when greater than zero', () => {
    render(<TooltipContent county={mockDemocratCounty} />);
    expect(screen.getByTestId('other-votes')).toHaveTextContent('20,000');
  });

  it('hides other votes when zero', () => {
    render(<TooltipContent county={mockNoOtherVotes} />);
    expect(screen.queryByTestId('other-votes')).not.toBeInTheDocument();
  });

  it('renders total votes formatted', () => {
    render(<TooltipContent county={mockDemocratCounty} />);
    expect(screen.getByTestId('total-votes')).toHaveTextContent('500,000');
  });

  it('renders Democrat margin with blue text', () => {
    render(<TooltipContent county={mockDemocratCounty} />);
    const marginEl = screen.getByTestId('margin');
    expect(marginEl).toHaveTextContent('Democrat +44.0%');
    expect(marginEl).toHaveClass('text-blue-400');
  });

  it('renders Republican margin with red text', () => {
    render(<TooltipContent county={mockRepublicanCounty} />);
    const marginEl = screen.getByTestId('margin');
    expect(marginEl).toHaveTextContent('Republican +5.3%');
    expect(marginEl).toHaveClass('text-red-400');
  });

  it('renders margin color indicator', () => {
    render(<TooltipContent county={mockDemocratCounty} />);
    const indicator = screen.getByTestId('margin-color-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({
      backgroundColor: expect.stringContaining('rgb'),
    });
  });
});
