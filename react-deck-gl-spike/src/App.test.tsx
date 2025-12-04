import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from './test/test-utils';
import App from './App';

// Mock react-map-gl/maplibre
vi.mock('react-map-gl/maplibre', () => ({
  default: vi.fn(({ children }) => (
    <div data-testid="maplibre-map">{children}</div>
  )),
}));

// Mock @deck.gl/react
vi.mock('@deck.gl/react', () => ({
  default: vi.fn(({ children }) => (
    <div data-testid="deckgl-container">{children}</div>
  )),
}));

// Mock maplibre-gl CSS import
vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));

describe('App', () => {
  it('renders the home page with heading', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /deck\.gl spike project/i })
    ).toBeInTheDocument();
  });

  it('renders navigation links on home page', () => {
    render(<App />);

    expect(
      screen.getByRole('link', { name: /earthquake map visualization/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('renders the earthquake map on /earthquakes route', () => {
    render(<App />, { route: '/earthquakes' });

    expect(screen.getByTestId('deckgl-container')).toBeInTheDocument();
    expect(screen.getByTestId('maplibre-map')).toBeInTheDocument();
  });

  it('renders the about page on /about route', () => {
    render(<App />, { route: '/about' });

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
  });
});
