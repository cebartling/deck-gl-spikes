import { create } from 'zustand';
import type { MapViewState } from '@deck.gl/core';

interface FlightMapViewStore {
  viewState: MapViewState;

  // Actions
  setViewState: (viewState: MapViewState) => void;
  setZoom: (zoom: number) => void;
  setCenter: (longitude: number, latitude: number) => void;
  setPitch: (pitch: number) => void;
  setBearing: (bearing: number) => void;
  reset: () => void;
}

// Initial view centered on US with tilt to show arc heights
const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 4,
  pitch: 30,
  bearing: 0,
};

export const useFlightMapViewStore = create<FlightMapViewStore>((set) => ({
  viewState: INITIAL_VIEW_STATE,

  setViewState: (viewState) => set({ viewState }),

  setZoom: (zoom) =>
    set((state) => ({
      viewState: { ...state.viewState, zoom },
    })),

  setCenter: (longitude, latitude) =>
    set((state) => ({
      viewState: { ...state.viewState, longitude, latitude },
    })),

  setPitch: (pitch) =>
    set((state) => ({
      viewState: { ...state.viewState, pitch },
    })),

  setBearing: (bearing) =>
    set((state) => ({
      viewState: { ...state.viewState, bearing },
    })),

  reset: () => set({ viewState: INITIAL_VIEW_STATE }),
}));

export { INITIAL_VIEW_STATE as FLIGHT_MAP_INITIAL_VIEW_STATE };
