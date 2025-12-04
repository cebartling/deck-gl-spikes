import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Header from './Header';

describe('Header', () => {
  it('renders the site title', () => {
    render(<Header />);

    expect(screen.getByText('deck.gl Spike')).toBeInTheDocument();
  });

  it('renders Home navigation link', () => {
    render(<Header />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders Earthquakes navigation link', () => {
    render(<Header />);

    const earthquakesLink = screen.getByRole('link', { name: /earthquakes/i });
    expect(earthquakesLink).toBeInTheDocument();
    expect(earthquakesLink).toHaveAttribute('href', '/earthquakes');
  });

  it('renders About navigation link', () => {
    render(<Header />);

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('highlights active Home link on home route', () => {
    render(<Header />, { route: '/' });

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('bg-gray-700', 'text-white');
  });

  it('highlights active Earthquakes link on earthquakes route', () => {
    render(<Header />, { route: '/earthquakes' });

    const earthquakesLink = screen.getByRole('link', { name: /earthquakes/i });
    expect(earthquakesLink).toHaveClass('bg-gray-700', 'text-white');
  });

  it('highlights active About link on about route', () => {
    render(<Header />, { route: '/about' });

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('bg-gray-700', 'text-white');
  });

  it('renders navigation element with correct structure', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});
