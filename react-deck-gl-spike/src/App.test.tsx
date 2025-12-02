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
  it('renders the earthquake map on home page', () => {
    render(<App />);

    expect(screen.getByTestId('deckgl-container')).toBeInTheDocument();
    expect(screen.getByTestId('maplibre-map')).toBeInTheDocument();
  });

  it('renders the map within a responsive container', () => {
    render(<App />);

    const container = screen.getByTestId('deckgl-container').closest('.h-screen');
    expect(container).toBeInTheDocument();
  });
});
