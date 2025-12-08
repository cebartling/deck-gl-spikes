import { describe, it, expect, beforeEach } from 'vitest';
import {
  useFlightMapViewStore,
  FLIGHT_MAP_INITIAL_VIEW_STATE,
} from './flightMapViewStore';

describe('flightMapViewStore', () => {
  beforeEach(() => {
    useFlightMapViewStore.getState().reset();
  });

  it('has correct initial view state', () => {
    const state = useFlightMapViewStore.getState();
    expect(state.viewState).toEqual(FLIGHT_MAP_INITIAL_VIEW_STATE);
  });

  it('initial view state is centered on US', () => {
    const { viewState } = useFlightMapViewStore.getState();
    expect(viewState.longitude).toBeCloseTo(-98.5795, 2);
    expect(viewState.latitude).toBeCloseTo(39.8283, 2);
  });

  it('initial view has tilt for arc visibility', () => {
    const { viewState } = useFlightMapViewStore.getState();
    expect(viewState.pitch).toBe(30);
  });

  it('setViewState updates the view state', () => {
    const newViewState = {
      longitude: -122.4,
      latitude: 37.8,
      zoom: 8,
      pitch: 45,
      bearing: 90,
    };
    useFlightMapViewStore.getState().setViewState(newViewState);
    expect(useFlightMapViewStore.getState().viewState).toEqual(newViewState);
  });

  it('setZoom updates only zoom', () => {
    const initialState = useFlightMapViewStore.getState().viewState;
    useFlightMapViewStore.getState().setZoom(8);
    const state = useFlightMapViewStore.getState().viewState;

    expect(state.zoom).toBe(8);
    expect(state.longitude).toBe(initialState.longitude);
    expect(state.latitude).toBe(initialState.latitude);
    expect(state.pitch).toBe(initialState.pitch);
    expect(state.bearing).toBe(initialState.bearing);
  });

  it('setCenter updates only longitude and latitude', () => {
    const initialState = useFlightMapViewStore.getState().viewState;
    useFlightMapViewStore.getState().setCenter(-122.4, 37.8);
    const state = useFlightMapViewStore.getState().viewState;

    expect(state.longitude).toBe(-122.4);
    expect(state.latitude).toBe(37.8);
    expect(state.zoom).toBe(initialState.zoom);
    expect(state.pitch).toBe(initialState.pitch);
    expect(state.bearing).toBe(initialState.bearing);
  });

  it('setPitch updates only pitch', () => {
    const initialState = useFlightMapViewStore.getState().viewState;
    useFlightMapViewStore.getState().setPitch(60);
    const state = useFlightMapViewStore.getState().viewState;

    expect(state.pitch).toBe(60);
    expect(state.longitude).toBe(initialState.longitude);
    expect(state.latitude).toBe(initialState.latitude);
    expect(state.zoom).toBe(initialState.zoom);
    expect(state.bearing).toBe(initialState.bearing);
  });

  it('setBearing updates only bearing', () => {
    const initialState = useFlightMapViewStore.getState().viewState;
    useFlightMapViewStore.getState().setBearing(45);
    const state = useFlightMapViewStore.getState().viewState;

    expect(state.bearing).toBe(45);
    expect(state.longitude).toBe(initialState.longitude);
    expect(state.latitude).toBe(initialState.latitude);
    expect(state.zoom).toBe(initialState.zoom);
    expect(state.pitch).toBe(initialState.pitch);
  });

  it('reset returns to initial state', () => {
    useFlightMapViewStore.getState().setViewState({
      longitude: -122.4,
      latitude: 37.8,
      zoom: 10,
      pitch: 60,
      bearing: 90,
    });
    useFlightMapViewStore.getState().reset();
    expect(useFlightMapViewStore.getState().viewState).toEqual(
      FLIGHT_MAP_INITIAL_VIEW_STATE
    );
  });

  it('FLIGHT_MAP_INITIAL_VIEW_STATE is exported', () => {
    expect(FLIGHT_MAP_INITIAL_VIEW_STATE).toBeDefined();
    expect(FLIGHT_MAP_INITIAL_VIEW_STATE.longitude).toBeDefined();
    expect(FLIGHT_MAP_INITIAL_VIEW_STATE.latitude).toBeDefined();
    expect(FLIGHT_MAP_INITIAL_VIEW_STATE.zoom).toBeDefined();
    expect(FLIGHT_MAP_INITIAL_VIEW_STATE.pitch).toBeDefined();
    expect(FLIGHT_MAP_INITIAL_VIEW_STATE.bearing).toBeDefined();
  });
});
