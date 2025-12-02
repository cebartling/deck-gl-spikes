import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './Home';

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

describe('Home', () => {
  it('renders the MapContainer', () => {
    render(<Home />);

    const container = screen.getByTestId('deckgl-container').closest('.h-screen');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('w-full', 'h-screen');
  });

  it('renders the EarthquakeMap component', () => {
    render(<Home />);

    expect(screen.getByTestId('deckgl-container')).toBeInTheDocument();
    expect(screen.getByTestId('maplibre-map')).toBeInTheDocument();
  });
});
