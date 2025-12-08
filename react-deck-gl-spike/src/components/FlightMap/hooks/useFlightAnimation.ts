import { useEffect, useRef } from 'react';
import { useFlightAnimationStore } from '../../../stores/flightAnimationStore';

// Throttle animation to ~60fps max
const FRAME_INTERVAL = 1000 / 60;

export function useFlightAnimation() {
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);

  const currentTime = useFlightAnimationStore((state) => state.currentTime);
  const isPlaying = useFlightAnimationStore((state) => state.isPlaying);
  const playbackSpeed = useFlightAnimationStore((state) => state.playbackSpeed);
  const loopEnabled = useFlightAnimationStore((state) => state.loopEnabled);
  const setCurrentTime = useFlightAnimationStore(
    (state) => state.setCurrentTime
  );
  const setIsPlaying = useFlightAnimationStore((state) => state.setIsPlaying);

  // Store current values in refs to avoid stale closures
  const currentTimeRef = useRef(currentTime);
  const playbackSpeedRef = useRef(playbackSpeed);
  const loopEnabledRef = useRef(loopEnabled);
  const setCurrentTimeRef = useRef(setCurrentTime);
  const setIsPlayingRef = useRef(setIsPlaying);

  // Update refs when values change
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    loopEnabledRef.current = loopEnabled;
  }, [loopEnabled]);

  useEffect(() => {
    setCurrentTimeRef.current = setCurrentTime;
  }, [setCurrentTime]);

  useEffect(() => {
    setIsPlayingRef.current = setIsPlaying;
  }, [setIsPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    // Reset timing refs when starting
    lastUpdateTimeRef.current = 0;
    lastFrameTimeRef.current = 0;

    const animate = (timestamp: number) => {
      // Throttle to target frame rate
      if (timestamp - lastFrameTimeRef.current < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      // Initialize last update time on first frame
      if (lastUpdateTimeRef.current === 0) {
        lastUpdateTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = timestamp;

      // Convert delta time (ms) to simulation minutes
      // playbackSpeed of 60 means 1 hour of simulation per 1 minute of real time
      const deltaMinutes = (deltaTime / 1000) * (playbackSpeedRef.current / 60);

      const newTime = currentTimeRef.current + deltaMinutes;

      // Handle loop or stop at end of day
      if (newTime >= 1440) {
        if (loopEnabledRef.current) {
          setCurrentTimeRef.current(newTime % 1440);
        } else {
          setCurrentTimeRef.current(1439.99); // Cap at end of day
          setIsPlayingRef.current(false);
          return;
        }
      } else {
        setCurrentTimeRef.current(newTime);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return {
    currentTime,
    isPlaying,
    playbackSpeed,
  };
}
