import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import Home from './Home';

describe('Home', () => {
  it('renders the page heading', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'deck.gl Spike Project'
    );
  });

  it('renders the description text', () => {
    render(<Home />);

    expect(
      screen.getByText(/React \+ TypeScript spike project/i)
    ).toBeInTheDocument();
  });

  it('renders call-to-action link to earthquakes page', () => {
    render(<Home />);

    const earthquakesLink = screen.getByRole('link', {
      name: /view earthquake map/i,
    });
    expect(earthquakesLink).toBeInTheDocument();
    expect(earthquakesLink).toHaveAttribute('href', '/earthquakes');
  });
});
