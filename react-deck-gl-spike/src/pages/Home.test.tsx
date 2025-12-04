import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  it('renders the page heading', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'deck.gl Spike Project'
    );
  });

  it('renders the description text', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/React \+ TypeScript spike project/i)
    ).toBeInTheDocument();
  });

  it('renders link to earthquakes page', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const earthquakesLink = screen.getByRole('link', {
      name: /earthquake map visualization/i,
    });
    expect(earthquakesLink).toBeInTheDocument();
    expect(earthquakesLink).toHaveAttribute('href', '/earthquakes');
  });

  it('renders link to about page', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});
