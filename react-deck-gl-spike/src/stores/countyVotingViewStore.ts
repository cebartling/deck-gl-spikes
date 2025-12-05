import { create } from 'zustand';
import type { MapViewState } from '@deck.gl/core';

/**
 * US-specific view bounds for the county voting map.
 * Constrains navigation to focus on the continental United States.
 */
export const US_VIEW_BOUNDS = {
  minLongitude: -130, // Western Alaska/Hawaii buffer
  maxLongitude: -65, // Eastern US border
  minLatitude: 24, // Southern US border (Key West area)
  maxLatitude: 50, // Northern US border (Canada border)
  minZoom: 3,
  maxZoom: 12,
} as const;

/**
 * Initial view state centered on the continental United States.
 */
export const US_INITIAL_VIEW_STATE: MapViewState = {
  longitude: -98.5795, // Geographic center of contiguous US
  latitude: 39.8283,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

/**
 * Constrains a view state to US bounds.
 * Prevents users from panning outside the US or zooming too far.
 */
export function constrainToUSBounds(viewState: MapViewState): MapViewState {
  return {
    ...viewState,
    longitude: Math.max(
      US_VIEW_BOUNDS.minLongitude,
      Math.min(US_VIEW_BOUNDS.maxLongitude, viewState.longitude)
    ),
    latitude: Math.max(
      US_VIEW_BOUNDS.minLatitude,
      Math.min(US_VIEW_BOUNDS.maxLatitude, viewState.latitude)
    ),
    zoom: Math.max(
      US_VIEW_BOUNDS.minZoom,
      Math.min(US_VIEW_BOUNDS.maxZoom, viewState.zoom)
    ),
  };
}

interface CountyVotingViewStore {
  viewState: MapViewState;

  // Actions
  setViewState: (viewState: MapViewState) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  flyTo: (target: Partial<MapViewState>) => void;
  reset: () => void;
}

export const useCountyVotingViewStore = create<CountyVotingViewStore>(
  (set, get) => ({
    viewState: US_INITIAL_VIEW_STATE,

    setViewState: (viewState) => {
      set({ viewState: constrainToUSBounds(viewState) });
    },

    zoomIn: () => {
      const { viewState } = get();
      if (viewState.zoom < US_VIEW_BOUNDS.maxZoom) {
        set({
          viewState: constrainToUSBounds({
            ...viewState,
            zoom: viewState.zoom + 1,
          }),
        });
      }
    },

    zoomOut: () => {
      const { viewState } = get();
      if (viewState.zoom > US_VIEW_BOUNDS.minZoom) {
        set({
          viewState: constrainToUSBounds({
            ...viewState,
            zoom: viewState.zoom - 1,
          }),
        });
      }
    },

    resetView: () => {
      set({ viewState: US_INITIAL_VIEW_STATE });
    },

    flyTo: (target) => {
      const { viewState } = get();
      set({
        viewState: constrainToUSBounds({
          ...viewState,
          ...target,
        }),
      });
    },

    reset: () => {
      set({ viewState: US_INITIAL_VIEW_STATE });
    },
  })
);
