import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useEarthquakeStore } from '../../stores/earthquakeStore';
import { useMapViewStore } from '../../stores/mapViewStore';

declare const global: typeof globalThis;

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
  default: vi.fn(({ children, viewState, controller, layers }) => (
    <div
      data-testid="deckgl-container"
      data-controller={controller?.toString()}
      data-layers-count={layers?.length?.toString()}
      data-longitude={viewState?.longitude?.toString()}
      data-latitude={viewState?.latitude?.toString()}
      data-zoom={viewState?.zoom?.toString()}
    >
      {children}
    </div>
  )),
}));

// Mock maplibre-gl CSS import
vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));

// Mock createEarthquakeLayer
vi.mock('./layers/earthquakeLayer', () => ({
  createEarthquakeLayer: vi.fn(() => ({ id: 'earthquake-layer' })),
}));

// Mock SizeLegend
vi.mock('./Legend', () => ({
  SizeLegend: vi.fn(() => <div data-testid="size-legend">Magnitude Legend</div>),
}));

import { EarthquakeMap } from './EarthquakeMap';

describe('EarthquakeMap', () => {
  beforeEach(() => {
    // Reset stores before each test
    useEarthquakeStore.getState().reset();
    useMapViewStore.getState().reset();
    // Mock fetch to prevent actual network calls
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  it('initializes with correct view state from store', () => {
    render(<EarthquakeMap />);

    const deckgl = screen.getByTestId('deckgl-container');
    expect(deckgl).toHaveAttribute('data-longitude', '0');
    expect(deckgl).toHaveAttribute('data-latitude', '20');
    expect(deckgl).toHaveAttribute('data-zoom', '1.5');
  });

  it('enables controller for user interaction', () => {
    render(<EarthquakeMap />);

    const deckgl = screen.getByTestId('deckgl-container');
    expect(deckgl).toHaveAttribute('data-controller', 'true');
  });

  it('renders with earthquake layer', () => {
    useEarthquakeStore.setState({
      earthquakes: [{ id: '1', longitude: 0, latitude: 0, depth: 10, magnitude: 5.0, timestamp: '', location: '' }],
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
    useEarthquakeStore.setState({ loading: true });

    render(<EarthquakeMap />);

    expect(screen.getByText('Loading earthquake data...')).toBeInTheDocument();
  });

  it('hides loading indicator after data loads', async () => {
    // Mock fetch to resolve immediately with empty data
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ type: 'FeatureCollection', features: [] }),
    } as Response);

    render(<EarthquakeMap />);

    await waitFor(() => {
      expect(
        screen.queryByText('Loading earthquake data...')
      ).not.toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    // Mock fetch to reject
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<EarthquakeMap />);

    await waitFor(() => {
      expect(screen.getByText('Error loading data: Network error')).toBeInTheDocument();
    });
  });

  it('reflects updated view state from store', () => {
    useMapViewStore.setState({
      viewState: {
        longitude: -122.4,
        latitude: 37.8,
        zoom: 10,
        pitch: 0,
        bearing: 0,
      },
    });

    render(<EarthquakeMap />);

    const deckgl = screen.getByTestId('deckgl-container');
    expect(deckgl).toHaveAttribute('data-longitude', '-122.4');
    expect(deckgl).toHaveAttribute('data-latitude', '37.8');
    expect(deckgl).toHaveAttribute('data-zoom', '10');
  });

  it('shows size legend when earthquake data is loaded', async () => {
    // Mock fetch to resolve with earthquake data
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        type: 'FeatureCollection',
        features: [{
          id: '1',
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0, 10] },
          properties: { mag: 5.0, time: '2024-01-01T00:00:00Z', place: 'Test' },
        }],
      }),
    } as Response);

    render(<EarthquakeMap />);

    await waitFor(() => {
      expect(screen.getByTestId('size-legend')).toBeInTheDocument();
    });
  });

  it('hides size legend while loading', () => {
    useEarthquakeStore.setState({
      earthquakes: [],
      loading: true,
      error: null,
    });

    render(<EarthquakeMap />);

    expect(screen.queryByTestId('size-legend')).not.toBeInTheDocument();
  });

  it('hides size legend when there is an error', () => {
    useEarthquakeStore.setState({
      earthquakes: [],
      loading: false,
      error: new Error('Test error'),
    });

    render(<EarthquakeMap />);

    expect(screen.queryByTestId('size-legend')).not.toBeInTheDocument();
  });

  it('hides size legend when no earthquakes loaded', () => {
    useEarthquakeStore.setState({
      earthquakes: [],
      loading: false,
      error: null,
    });

    render(<EarthquakeMap />);

    expect(screen.queryByTestId('size-legend')).not.toBeInTheDocument();
  });
});
