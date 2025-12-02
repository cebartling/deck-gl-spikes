import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useMapViewStore, INITIAL_VIEW_STATE } from './mapViewStore';

describe('mapViewStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useMapViewStore.getState().reset();
  });

  describe('initial state', () => {
    it('has correct initial view state', () => {
      expect(useMapViewStore.getState().viewState).toEqual(INITIAL_VIEW_STATE);
    });

    it('has longitude of 0', () => {
      expect(useMapViewStore.getState().viewState.longitude).toBe(0);
    });

    it('has latitude of 20', () => {
      expect(useMapViewStore.getState().viewState.latitude).toBe(20);
    });

    it('has zoom of 1.5', () => {
      expect(useMapViewStore.getState().viewState.zoom).toBe(1.5);
    });

    it('has pitch of 0', () => {
      expect(useMapViewStore.getState().viewState.pitch).toBe(0);
    });

    it('has bearing of 0', () => {
      expect(useMapViewStore.getState().viewState.bearing).toBe(0);
    });
  });

  describe('setViewState', () => {
    it('updates entire view state', () => {
      const newViewState = {
        longitude: -122.4,
        latitude: 37.8,
        zoom: 10,
        pitch: 45,
        bearing: 90,
      };

      act(() => {
        useMapViewStore.getState().setViewState(newViewState);
      });

      expect(useMapViewStore.getState().viewState).toEqual(newViewState);
    });
  });

  describe('setZoom', () => {
    it('updates only zoom while preserving other properties', () => {
      act(() => {
        useMapViewStore.getState().setZoom(5);
      });

      expect(useMapViewStore.getState().viewState.zoom).toBe(5);
      expect(useMapViewStore.getState().viewState.longitude).toBe(0);
      expect(useMapViewStore.getState().viewState.latitude).toBe(20);
    });
  });

  describe('setCenter', () => {
    it('updates longitude and latitude while preserving other properties', () => {
      act(() => {
        useMapViewStore.getState().setCenter(-122.4, 37.8);
      });

      expect(useMapViewStore.getState().viewState.longitude).toBe(-122.4);
      expect(useMapViewStore.getState().viewState.latitude).toBe(37.8);
      expect(useMapViewStore.getState().viewState.zoom).toBe(1.5);
    });
  });

  describe('setPitch', () => {
    it('updates only pitch while preserving other properties', () => {
      act(() => {
        useMapViewStore.getState().setPitch(60);
      });

      expect(useMapViewStore.getState().viewState.pitch).toBe(60);
      expect(useMapViewStore.getState().viewState.zoom).toBe(1.5);
    });
  });

  describe('setBearing', () => {
    it('updates only bearing while preserving other properties', () => {
      act(() => {
        useMapViewStore.getState().setBearing(180);
      });

      expect(useMapViewStore.getState().viewState.bearing).toBe(180);
      expect(useMapViewStore.getState().viewState.zoom).toBe(1.5);
    });
  });

  describe('reset', () => {
    it('resets view state to initial values', () => {
      act(() => {
        useMapViewStore.getState().setViewState({
          longitude: -122.4,
          latitude: 37.8,
          zoom: 10,
          pitch: 45,
          bearing: 90,
        });
        useMapViewStore.getState().reset();
      });

      expect(useMapViewStore.getState().viewState).toEqual(INITIAL_VIEW_STATE);
    });
  });

  describe('INITIAL_VIEW_STATE export', () => {
    it('exports correct initial view state', () => {
      expect(INITIAL_VIEW_STATE).toEqual({
        longitude: 0,
        latitude: 20,
        zoom: 1.5,
        pitch: 0,
        bearing: 0,
      });
    });
  });
});
