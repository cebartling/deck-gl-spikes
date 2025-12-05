import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import {
  useCountyVotingViewStore,
  constrainToUSBounds,
  US_VIEW_BOUNDS,
  US_INITIAL_VIEW_STATE,
} from './countyVotingViewStore';

describe('constrainToUSBounds', () => {
  it('does not modify view state within bounds', () => {
    const viewState = {
      longitude: -98,
      latitude: 39,
      zoom: 5,
      pitch: 0,
      bearing: 0,
    };

    const result = constrainToUSBounds(viewState);

    expect(result.longitude).toBe(-98);
    expect(result.latitude).toBe(39);
    expect(result.zoom).toBe(5);
  });

  it('constrains longitude to minimum bound', () => {
    const viewState = {
      longitude: -150, // Beyond western limit
      latitude: 39,
      zoom: 5,
      pitch: 0,
      bearing: 0,
    };

    const result = constrainToUSBounds(viewState);

    expect(result.longitude).toBe(US_VIEW_BOUNDS.minLongitude);
  });

  it('constrains longitude to maximum bound', () => {
    const viewState = {
      longitude: -50, // Beyond eastern limit
      latitude: 39,
      zoom: 5,
      pitch: 0,
      bearing: 0,
    };

    const result = constrainToUSBounds(viewState);

    expect(result.longitude).toBe(US_VIEW_BOUNDS.maxLongitude);
  });

  it('constrains latitude to minimum bound', () => {
    const viewState = {
      longitude: -98,
      latitude: 20, // Below southern limit
      zoom: 5,
      pitch: 0,
      bearing: 0,
    };

    const result = constrainToUSBounds(viewState);

    expect(result.latitude).toBe(US_VIEW_BOUNDS.minLatitude);
  });

  it('constrains latitude to maximum bound', () => {
    const viewState = {
      longitude: -98,
      latitude: 55, // Above northern limit
      zoom: 5,
      pitch: 0,
      bearing: 0,
    };

    const result = constrainToUSBounds(viewState);

    expect(result.latitude).toBe(US_VIEW_BOUNDS.maxLatitude);
  });

  it('constrains zoom to minimum bound', () => {
    const viewState = {
      longitude: -98,
      latitude: 39,
      zoom: 1, // Below minimum
      pitch: 0,
      bearing: 0,
    };

    const result = constrainToUSBounds(viewState);

    expect(result.zoom).toBe(US_VIEW_BOUNDS.minZoom);
  });

  it('constrains zoom to maximum bound', () => {
    const viewState = {
      longitude: -98,
      latitude: 39,
      zoom: 20, // Above maximum
      pitch: 0,
      bearing: 0,
    };

    const result = constrainToUSBounds(viewState);

    expect(result.zoom).toBe(US_VIEW_BOUNDS.maxZoom);
  });

  it('preserves pitch and bearing', () => {
    const viewState = {
      longitude: -98,
      latitude: 39,
      zoom: 5,
      pitch: 45,
      bearing: 90,
    };

    const result = constrainToUSBounds(viewState);

    expect(result.pitch).toBe(45);
    expect(result.bearing).toBe(90);
  });
});

describe('useCountyVotingViewStore', () => {
  beforeEach(() => {
    act(() => {
      useCountyVotingViewStore.getState().resetView();
    });
  });

  it('initializes with US initial view state', () => {
    const { viewState } = useCountyVotingViewStore.getState();

    expect(viewState).toEqual(US_INITIAL_VIEW_STATE);
  });

  describe('setViewState', () => {
    it('updates view state', () => {
      const newState = {
        longitude: -95,
        latitude: 35,
        zoom: 6,
        pitch: 0,
        bearing: 0,
      };

      act(() => {
        useCountyVotingViewStore.getState().setViewState(newState);
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState.longitude).toBe(-95);
      expect(viewState.latitude).toBe(35);
      expect(viewState.zoom).toBe(6);
    });

    it('constrains view state to US bounds', () => {
      const outOfBoundsState = {
        longitude: -200, // Way beyond limits
        latitude: 60,
        zoom: 1,
        pitch: 0,
        bearing: 0,
      };

      act(() => {
        useCountyVotingViewStore.getState().setViewState(outOfBoundsState);
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState.longitude).toBe(US_VIEW_BOUNDS.minLongitude);
      expect(viewState.latitude).toBe(US_VIEW_BOUNDS.maxLatitude);
      expect(viewState.zoom).toBe(US_VIEW_BOUNDS.minZoom);
    });
  });

  describe('zoomIn', () => {
    it('increments zoom by 1', () => {
      act(() => {
        useCountyVotingViewStore.getState().zoomIn();
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState.zoom).toBe(US_INITIAL_VIEW_STATE.zoom + 1);
    });

    it('does not exceed max zoom', () => {
      act(() => {
        useCountyVotingViewStore.getState().setViewState({
          ...US_INITIAL_VIEW_STATE,
          zoom: US_VIEW_BOUNDS.maxZoom,
        });
      });

      act(() => {
        useCountyVotingViewStore.getState().zoomIn();
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState.zoom).toBe(US_VIEW_BOUNDS.maxZoom);
    });
  });

  describe('zoomOut', () => {
    it('decrements zoom by 1', () => {
      act(() => {
        useCountyVotingViewStore.getState().zoomOut();
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState.zoom).toBe(US_INITIAL_VIEW_STATE.zoom - 1);
    });

    it('does not go below min zoom', () => {
      act(() => {
        useCountyVotingViewStore.getState().setViewState({
          ...US_INITIAL_VIEW_STATE,
          zoom: US_VIEW_BOUNDS.minZoom,
        });
      });

      act(() => {
        useCountyVotingViewStore.getState().zoomOut();
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState.zoom).toBe(US_VIEW_BOUNDS.minZoom);
    });
  });

  describe('resetView', () => {
    it('resets to initial view state', () => {
      act(() => {
        useCountyVotingViewStore.getState().setViewState({
          longitude: -80,
          latitude: 30,
          zoom: 8,
          pitch: 0,
          bearing: 0,
        });
      });

      act(() => {
        useCountyVotingViewStore.getState().resetView();
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState).toEqual(US_INITIAL_VIEW_STATE);
    });
  });

  describe('flyTo', () => {
    it('updates only specified properties', () => {
      act(() => {
        useCountyVotingViewStore.getState().flyTo({
          longitude: -80,
          latitude: 30,
        });
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState.longitude).toBe(-80);
      expect(viewState.latitude).toBe(30);
      expect(viewState.zoom).toBe(US_INITIAL_VIEW_STATE.zoom);
    });

    it('constrains flyTo target to US bounds', () => {
      act(() => {
        useCountyVotingViewStore.getState().flyTo({
          longitude: -200,
          latitude: 80,
        });
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState.longitude).toBe(US_VIEW_BOUNDS.minLongitude);
      expect(viewState.latitude).toBe(US_VIEW_BOUNDS.maxLatitude);
    });
  });

  describe('reset', () => {
    it('resets store to initial state', () => {
      act(() => {
        useCountyVotingViewStore.getState().setViewState({
          longitude: -80,
          latitude: 30,
          zoom: 8,
          pitch: 0,
          bearing: 0,
        });
      });

      act(() => {
        useCountyVotingViewStore.getState().resetView();
      });

      const { viewState } = useCountyVotingViewStore.getState();
      expect(viewState).toEqual(US_INITIAL_VIEW_STATE);
    });
  });
});
