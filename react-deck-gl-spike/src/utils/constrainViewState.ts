import type { MapViewState } from '@deck.gl/core';

/**
 * Geographic bounds to constrain map panning.
 * Prevents users from panning too far and getting lost.
 */
export const MAP_BOUNDS = {
  minLongitude: -180,
  maxLongitude: 180,
  minLatitude: -85, // Web Mercator limit
  maxLatitude: 85, // Web Mercator limit
} as const;

/**
 * Zoom constraints to keep the map at usable zoom levels.
 */
export const ZOOM_BOUNDS = {
  minZoom: 0.5,
  maxZoom: 20,
} as const;

/**
 * Constrains a view state to stay within geographic and zoom bounds.
 * Prevents users from panning off the map or zooming too far in/out.
 *
 * @param viewState - The view state to constrain
 * @returns A new view state with constrained values
 */
export function constrainViewState(viewState: MapViewState): MapViewState {
  return {
    ...viewState,
    longitude: Math.max(
      MAP_BOUNDS.minLongitude,
      Math.min(MAP_BOUNDS.maxLongitude, viewState.longitude)
    ),
    latitude: Math.max(
      MAP_BOUNDS.minLatitude,
      Math.min(MAP_BOUNDS.maxLatitude, viewState.latitude)
    ),
    zoom: Math.max(
      ZOOM_BOUNDS.minZoom,
      Math.min(ZOOM_BOUNDS.maxZoom, viewState.zoom)
    ),
  };
}
