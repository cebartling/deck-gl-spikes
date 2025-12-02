import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock react-map-gl/maplibre
vi.mock('react-map-gl/maplibre', () => ({
  default: vi.fn(({ children, mapStyle }) => (
    <div data-testid="maplibre-map" data-map-style={mapStyle}>
      {children}
    </div>
  )),
}));

// Mock @deck.gl/react
vi.mock('@deck.gl/react', () => ({
  default: vi.fn(({ children, initialViewState, controller, layers }) => (
    <div
      data-testid="deckgl-container"
      data-controller={controller?.toString()}
      data-layers-count={layers?.length?.toString()}
      data-initial-longitude={initialViewState?.longitude?.toString()}
      data-initial-latitude={initialViewState?.latitude?.toString()}
      data-initial-zoom={initialViewState?.zoom?.toString()}
    >
      {children}
    </div>
  )),
}));

// Mock maplibre-gl CSS import
vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));

import { EarthquakeMap } from './EarthquakeMap';

describe('EarthquakeMap', () => {
  it('renders the map container', () => {
    render(<EarthquakeMap />);

    const container = screen.getByTestId('deckgl-container').parentElement;
    expect(container).toHaveClass('w-full', 'h-full', 'relative');
  });

  it('renders DeckGL component', () => {
    render(<EarthquakeMap />);

    expect(screen.getByTestId('deckgl-container')).toBeInTheDocument();
  });

  it('renders MapLibre map component', () => {
    render(<EarthquakeMap />);

    expect(screen.getByTestId('maplibre-map')).toBeInTheDocument();
  });

  it('initializes with correct view state', () => {
    render(<EarthquakeMap />);

    const deckgl = screen.getByTestId('deckgl-container');
    expect(deckgl).toHaveAttribute('data-initial-longitude', '0');
    expect(deckgl).toHaveAttribute('data-initial-latitude', '20');
    expect(deckgl).toHaveAttribute('data-initial-zoom', '1.5');
  });

  it('enables controller for user interaction', () => {
    render(<EarthquakeMap />);

    const deckgl = screen.getByTestId('deckgl-container');
    expect(deckgl).toHaveAttribute('data-controller', 'true');
  });

  it('initializes with empty layers array', () => {
    render(<EarthquakeMap />);

    const deckgl = screen.getByTestId('deckgl-container');
    expect(deckgl).toHaveAttribute('data-layers-count', '0');
  });

  it('uses CARTO Positron map style', () => {
    render(<EarthquakeMap />);

    const map = screen.getByTestId('maplibre-map');
    expect(map).toHaveAttribute(
      'data-map-style',
      'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
    );
  });
});
