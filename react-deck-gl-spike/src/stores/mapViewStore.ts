import { create } from 'zustand';
import type { MapViewState } from '@deck.gl/core';

interface MapViewStore {
  viewState: MapViewState;

  // Actions
  setViewState: (viewState: MapViewState) => void;
  setZoom: (zoom: number) => void;
  setCenter: (longitude: number, latitude: number) => void;
  setPitch: (pitch: number) => void;
  setBearing: (bearing: number) => void;
  reset: () => void;
}

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 0,
  latitude: 20,
  zoom: 1.5,
  pitch: 0,
  bearing: 0,
};

export const useMapViewStore = create<MapViewStore>((set) => ({
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

export { INITIAL_VIEW_STATE };
