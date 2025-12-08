import { create } from 'zustand';
import type { AnimationState, ScheduledFlight } from '../types/flightSchedule';

interface FlightAnimationState extends AnimationState {
  scheduledFlights: ScheduledFlight[];
  animationEnabled: boolean;

  // Actions
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayback: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setLoopEnabled: (enabled: boolean) => void;
  setScheduledFlights: (flights: ScheduledFlight[]) => void;
  setAnimationEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const initialState: AnimationState & {
  scheduledFlights: ScheduledFlight[];
  animationEnabled: boolean;
} = {
  currentTime: 0, // Start at midnight
  isPlaying: false,
  playbackSpeed: 120, // 2 hours per minute by default
  loopEnabled: true,
  scheduledFlights: [],
  animationEnabled: false,
};

export const useFlightAnimationStore = create<FlightAnimationState>((set) => ({
  ...initialState,

  setCurrentTime: (time) => set({ currentTime: time % 1440 }), // Wrap at 24 hours
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setLoopEnabled: (loopEnabled) => set({ loopEnabled }),
  setScheduledFlights: (scheduledFlights) => set({ scheduledFlights }),
  setAnimationEnabled: (animationEnabled) =>
    set((state) => ({
      animationEnabled,
      // Stop playback when disabling animation
      isPlaying: animationEnabled ? state.isPlaying : false,
    })),
  reset: () => set(initialState),
}));
