import { describe, it, expect, beforeEach } from 'vitest';
import { useFlightAnimationStore } from './flightAnimationStore';
import type { ScheduledFlight } from '../types/flightSchedule';

describe('flightAnimationStore', () => {
  beforeEach(() => {
    useFlightAnimationStore.getState().reset();
  });

  it('has correct initial state', () => {
    const state = useFlightAnimationStore.getState();
    expect(state.currentTime).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.playbackSpeed).toBe(60);
    expect(state.loopEnabled).toBe(true);
    expect(state.scheduledFlights).toEqual([]);
    expect(state.animationEnabled).toBe(false);
  });

  describe('setCurrentTime', () => {
    it('updates current time', () => {
      useFlightAnimationStore.getState().setCurrentTime(720);
      expect(useFlightAnimationStore.getState().currentTime).toBe(720);
    });

    it('wraps time at 1440 minutes (24 hours)', () => {
      useFlightAnimationStore.getState().setCurrentTime(1500);
      expect(useFlightAnimationStore.getState().currentTime).toBe(60);
    });

    it('wraps large values correctly', () => {
      useFlightAnimationStore.getState().setCurrentTime(2880);
      expect(useFlightAnimationStore.getState().currentTime).toBe(0);
    });
  });

  describe('setIsPlaying', () => {
    it('updates playing state to true', () => {
      useFlightAnimationStore.getState().setIsPlaying(true);
      expect(useFlightAnimationStore.getState().isPlaying).toBe(true);
    });

    it('updates playing state to false', () => {
      useFlightAnimationStore.getState().setIsPlaying(true);
      useFlightAnimationStore.getState().setIsPlaying(false);
      expect(useFlightAnimationStore.getState().isPlaying).toBe(false);
    });
  });

  describe('togglePlayback', () => {
    it('toggles from false to true', () => {
      useFlightAnimationStore.getState().togglePlayback();
      expect(useFlightAnimationStore.getState().isPlaying).toBe(true);
    });

    it('toggles from true to false', () => {
      useFlightAnimationStore.getState().setIsPlaying(true);
      useFlightAnimationStore.getState().togglePlayback();
      expect(useFlightAnimationStore.getState().isPlaying).toBe(false);
    });
  });

  describe('setPlaybackSpeed', () => {
    it('updates playback speed', () => {
      useFlightAnimationStore.getState().setPlaybackSpeed(120);
      expect(useFlightAnimationStore.getState().playbackSpeed).toBe(120);
    });
  });

  describe('setLoopEnabled', () => {
    it('updates loop enabled to true', () => {
      useFlightAnimationStore.getState().setLoopEnabled(false);
      useFlightAnimationStore.getState().setLoopEnabled(true);
      expect(useFlightAnimationStore.getState().loopEnabled).toBe(true);
    });

    it('updates loop enabled to false', () => {
      useFlightAnimationStore.getState().setLoopEnabled(false);
      expect(useFlightAnimationStore.getState().loopEnabled).toBe(false);
    });
  });

  describe('setScheduledFlights', () => {
    it('updates scheduled flights', () => {
      const mockFlights: ScheduledFlight[] = [
        {
          id: 'AA100',
          flightNumber: 'AA100',
          origin: {
            code: 'LAX',
            name: 'Los Angeles International',
            city: 'Los Angeles',
            country: 'USA',
            longitude: -118.4,
            latitude: 33.9,
          },
          destination: {
            code: 'JFK',
            name: 'JFK International',
            city: 'New York',
            country: 'USA',
            longitude: -73.8,
            latitude: 40.6,
          },
          departureTime: 360,
          arrivalTime: 660,
        },
      ];

      useFlightAnimationStore.getState().setScheduledFlights(mockFlights);
      expect(useFlightAnimationStore.getState().scheduledFlights).toEqual(
        mockFlights
      );
    });
  });

  describe('setAnimationEnabled', () => {
    it('enables animation', () => {
      useFlightAnimationStore.getState().setAnimationEnabled(true);
      expect(useFlightAnimationStore.getState().animationEnabled).toBe(true);
    });

    it('disables animation and stops playback', () => {
      useFlightAnimationStore.getState().setIsPlaying(true);
      useFlightAnimationStore.getState().setAnimationEnabled(true);
      useFlightAnimationStore.getState().setAnimationEnabled(false);

      const state = useFlightAnimationStore.getState();
      expect(state.animationEnabled).toBe(false);
      expect(state.isPlaying).toBe(false);
    });

    it('preserves playback state when enabling', () => {
      useFlightAnimationStore.getState().setIsPlaying(true);
      useFlightAnimationStore.getState().setAnimationEnabled(true);

      expect(useFlightAnimationStore.getState().isPlaying).toBe(true);
    });
  });

  describe('reset', () => {
    it('resets to initial state', () => {
      useFlightAnimationStore.getState().setCurrentTime(720);
      useFlightAnimationStore.getState().setIsPlaying(true);
      useFlightAnimationStore.getState().setPlaybackSpeed(120);
      useFlightAnimationStore.getState().setLoopEnabled(false);
      useFlightAnimationStore.getState().setAnimationEnabled(true);

      useFlightAnimationStore.getState().reset();

      const state = useFlightAnimationStore.getState();
      expect(state.currentTime).toBe(0);
      expect(state.isPlaying).toBe(false);
      expect(state.playbackSpeed).toBe(60);
      expect(state.loopEnabled).toBe(true);
      expect(state.animationEnabled).toBe(false);
      expect(state.scheduledFlights).toEqual([]);
    });
  });
});
