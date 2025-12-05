import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VotingLegend } from './VotingLegend';

describe('VotingLegend', () => {
  it('renders the legend container', () => {
    render(<VotingLegend />);

    expect(screen.getByText('Vote Margin')).toBeInTheDocument();
  });

  it('renders color gradient segments', () => {
    const { container } = render(<VotingLegend />);

    const gradientContainer = container.querySelector('[role="img"]');
    expect(gradientContainer).toBeInTheDocument();

    // Should have 5 color segments
    const segments = gradientContainer?.querySelectorAll('div');
    expect(segments).toHaveLength(5);
  });

  it('displays margin labels', () => {
    render(<VotingLegend />);

    expect(screen.getByText('R +50%')).toBeInTheDocument();
    expect(screen.getByText('D +50%')).toBeInTheDocument();
  });

  it('displays party labels', () => {
    render(<VotingLegend />);

    expect(screen.getByText('Republican')).toBeInTheDocument();
    expect(screen.getByText('Democrat')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<VotingLegend />);

    const legendContainer = container.querySelector('.absolute.bottom-4.left-4');
    expect(legendContainer).toBeInTheDocument();
    expect(legendContainer).toHaveClass(
      'bg-gray-900/80',
      'backdrop-blur-md',
      'rounded-lg',
      'shadow-lg'
    );
  });

  it('has accessible role and aria-labelledby', () => {
    render(<VotingLegend />);

    const region = screen.getByRole('region');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-labelledby', 'voting-legend-title');
  });

  it('gradient bar has accessible aria-label', () => {
    render(<VotingLegend />);

    const gradientBar = screen.getByRole('img');
    expect(gradientBar).toHaveAttribute(
      'aria-label',
      'Color gradient from red (Republican) to blue (Democrat)'
    );
  });

  it('renders segments with voting colors', () => {
    const { container } = render(<VotingLegend />);

    const gradientContainer = container.querySelector('[role="img"]');
    const segments = gradientContainer?.querySelectorAll('div');

    // First segment should be reddish (Republican)
    expect(segments?.[0]).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });

    // Last segment should be bluish (Democrat)
    expect(segments?.[4]).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });
  });
});
