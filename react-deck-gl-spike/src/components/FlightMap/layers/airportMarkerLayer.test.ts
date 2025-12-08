import { describe, it, expect } from 'vitest';
import { createAirportMarkerLayer } from './airportMarkerLayer';
import type { Airport } from '../../../types/flight';

const mockAirport: Airport = {
  code: 'LAX',
  name: 'Los Angeles International Airport',
  city: 'Los Angeles',
  country: 'USA',
  longitude: -118.4085,
  latitude: 33.9425,
};

describe('createAirportMarkerLayer', () => {
  it('returns null when no airport selected', () => {
    const layer = createAirportMarkerLayer({ selectedAirport: null });
    expect(layer).toBeNull();
  });

  it('returns ScatterplotLayer when airport selected', () => {
    const layer = createAirportMarkerLayer({ selectedAirport: mockAirport });

    expect(layer).not.toBeNull();
    expect(layer?.id).toBe('selected-airport-marker');
  });

  it('sets data to array containing selected airport', () => {
    const layer = createAirportMarkerLayer({ selectedAirport: mockAirport });

    expect(layer?.props.data).toHaveLength(1);
    expect(layer?.props.data[0]).toBe(mockAirport);
  });

  it('layer is not pickable', () => {
    const layer = createAirportMarkerLayer({ selectedAirport: mockAirport });

    expect(layer?.props.pickable).toBe(false);
  });

  it('has correct position accessor', () => {
    const layer = createAirportMarkerLayer({ selectedAirport: mockAirport });

    const getPosition = layer?.props.getPosition as (d: Airport) => number[];
    const position = getPosition(mockAirport);

    expect(position).toEqual([-118.4085, 33.9425]);
  });

  it('has cyan fill color', () => {
    const layer = createAirportMarkerLayer({ selectedAirport: mockAirport });

    expect(layer?.props.getFillColor).toEqual([0, 255, 255, 100]);
  });

  it('has cyan line color', () => {
    const layer = createAirportMarkerLayer({ selectedAirport: mockAirport });

    expect(layer?.props.getLineColor).toEqual([0, 255, 255, 255]);
  });

  it('is stroked', () => {
    const layer = createAirportMarkerLayer({ selectedAirport: mockAirport });

    expect(layer?.props.stroked).toBe(true);
  });

  it('has minimum line width', () => {
    const layer = createAirportMarkerLayer({ selectedAirport: mockAirport });

    expect(layer?.props.lineWidthMinPixels).toBe(3);
  });
});
