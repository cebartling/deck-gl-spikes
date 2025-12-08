import { describe, it, expect, beforeEach } from 'vitest';
import { useFlightFilterStore } from './flightFilterStore';

describe('flightFilterStore', () => {
  beforeEach(() => {
    useFlightFilterStore.getState().reset();
  });

  it('initial state has null selectedAirport', () => {
    const { selectedAirport } = useFlightFilterStore.getState();
    expect(selectedAirport).toBeNull();
  });

  it('initial filterMode is "both"', () => {
    const { filterMode } = useFlightFilterStore.getState();
    expect(filterMode).toBe('both');
  });

  it('setSelectedAirport updates state', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');
    expect(useFlightFilterStore.getState().selectedAirport).toBe('LAX');
  });

  it('setSelectedAirport with null clears selection', () => {
    useFlightFilterStore.getState().setSelectedAirport('LAX');
    useFlightFilterStore.getState().setSelectedAirport(null);
    expect(useFlightFilterStore.getState().selectedAirport).toBeNull();
  });

  it('setFilterMode updates state', () => {
    useFlightFilterStore.getState().setFilterMode('origin');
    expect(useFlightFilterStore.getState().filterMode).toBe('origin');

    useFlightFilterStore.getState().setFilterMode('destination');
    expect(useFlightFilterStore.getState().filterMode).toBe('destination');
  });

  it('clearFilter resets selectedAirport to null', () => {
    useFlightFilterStore.getState().setSelectedAirport('JFK');
    useFlightFilterStore.getState().clearFilter();
    expect(useFlightFilterStore.getState().selectedAirport).toBeNull();
  });

  it('clearFilter preserves filterMode', () => {
    useFlightFilterStore.getState().setFilterMode('origin');
    useFlightFilterStore.getState().setSelectedAirport('JFK');
    useFlightFilterStore.getState().clearFilter();
    expect(useFlightFilterStore.getState().filterMode).toBe('origin');
  });

  it('reset returns to initial state', () => {
    useFlightFilterStore.getState().setSelectedAirport('ORD');
    useFlightFilterStore.getState().setFilterMode('destination');
    useFlightFilterStore.getState().reset();

    const state = useFlightFilterStore.getState();
    expect(state.selectedAirport).toBeNull();
    expect(state.filterMode).toBe('both');
  });
});
