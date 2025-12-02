import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

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

// Mock useEarthquakeData hook
const mockUseEarthquakeData = vi.fn();
vi.mock('../../hooks/useEarthquakeData', () => ({
  useEarthquakeData: () => mockUseEarthquakeData(),
}));

// Mock createEarthquakeLayer
vi.mock('./layers/earthquakeLayer', () => ({
  createEarthquakeLayer: vi.fn(() => ({ id: 'earthquake-layer' })),
}));

import { EarthquakeMap } from './EarthquakeMap';

describe('EarthquakeMap', () => {
  beforeEach(() => {
    mockUseEarthquakeData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });
  });

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

  it('renders with earthquake layer', () => {
    mockUseEarthquakeData.mockReturnValue({
      data: [{ id: '1', longitude: 0, latitude: 0, depth: 10, magnitude: 5.0 }],
      loading: false,
      error: null,
    });

    render(<EarthquakeMap />);

    const deckgl = screen.getByTestId('deckgl-container');
    expect(deckgl).toHaveAttribute('data-layers-count', '1');
  });

  it('uses CARTO Positron map style', () => {
    render(<EarthquakeMap />);

    const map = screen.getByTestId('maplibre-map');
    expect(map).toHaveAttribute(
      'data-map-style',
      'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
    );
  });

  it('shows loading indicator while fetching data', () => {
    mockUseEarthquakeData.mockReturnValue({
      data: [],
      loading: true,
      error: null,
    });

    render(<EarthquakeMap />);

    expect(screen.getByText('Loading earthquake data...')).toBeInTheDocument();
  });

  it('hides loading indicator after data loads', async () => {
    mockUseEarthquakeData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    render(<EarthquakeMap />);

    await waitFor(() => {
      expect(
        screen.queryByText('Loading earthquake data...')
      ).not.toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', () => {
    mockUseEarthquakeData.mockReturnValue({
      data: [],
      loading: false,
      error: new Error('Network error'),
    });

    render(<EarthquakeMap />);

    expect(screen.getByText('Error loading data: Network error')).toBeInTheDocument();
  });
});
