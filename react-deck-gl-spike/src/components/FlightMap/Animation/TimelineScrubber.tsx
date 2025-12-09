import { useCallback, useRef, useEffect } from 'react';
import { useFlightAnimationStore } from '../../../stores/flightAnimationStore';

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

export function TimelineScrubber() {
  const currentTime = useFlightAnimationStore((state) => state.currentTime);
  const setCurrentTime = useFlightAnimationStore(
    (state) => state.setCurrentTime
  );
  const isPlaying = useFlightAnimationStore((state) => state.isPlaying);
  const setIsPlaying = useFlightAnimationStore((state) => state.setIsPlaying);

  const scrubberRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const wasPlayingBeforeDrag = useRef(false);

  const updateTimeFromPosition = useCallback(
    (clientX: number) => {
      if (!scrubberRef.current) return;

      const rect = scrubberRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * 1440;

      setCurrentTime(newTime);
    },
    [setCurrentTime]
  );

  // Use refs to store the latest callbacks for global event listeners
  const updateTimeRef = useRef(updateTimeFromPosition);
  const setIsPlayingRef = useRef(setIsPlaying);

  useEffect(() => {
    updateTimeRef.current = updateTimeFromPosition;
    setIsPlayingRef.current = setIsPlaying;
  }, [updateTimeFromPosition, setIsPlaying]);

  // Define global event handlers with cleanup
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      updateTimeRef.current(e.clientX);
    };

    const handleGlobalMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;

      // Resume playback if it was playing before drag
      if (wasPlayingBeforeDrag.current) {
        setIsPlayingRef.current(true);
      }

      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };

    // Store handlers on window for access from mousedown
    (window as unknown as Record<string, unknown>).__timelineScrubberHandlers =
      {
        handleGlobalMouseMove,
        handleGlobalMouseUp,
      };

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const handleScrubberClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging.current) return;
      updateTimeFromPosition(e.clientX);
    },
    [updateTimeFromPosition]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isDragging.current = true;
      wasPlayingBeforeDrag.current = isPlaying;

      // Pause while scrubbing
      if (isPlaying) {
        setIsPlaying(false);
      }

      updateTimeFromPosition(e.clientX);

      // Add global mouse event listeners
      const handlers = (
        window as unknown as Record<
          string,
          {
            handleGlobalMouseMove: (e: MouseEvent) => void;
            handleGlobalMouseUp: () => void;
          }
        >
      ).__timelineScrubberHandlers;
      if (handlers) {
        document.addEventListener('mousemove', handlers.handleGlobalMouseMove);
        document.addEventListener('mouseup', handlers.handleGlobalMouseUp);
      }
    },
    [isPlaying, setIsPlaying, updateTimeFromPosition]
  );

  const progress = (currentTime / 1440) * 100;

  return (
    <div
      className="bg-gray-900/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/10"
      data-testid="timeline-scrubber"
    >
      {/* Time display */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">12:00 AM</span>
        <span
          className="text-white font-mono text-lg"
          data-testid="time-display"
        >
          {formatTime(currentTime)}
        </span>
        <span className="text-xs text-gray-400">11:59 PM</span>
      </div>

      {/* Scrubber track */}
      <div
        ref={scrubberRef}
        className="relative h-4 bg-gray-700 rounded-full cursor-pointer select-none"
        onClick={handleScrubberClick}
        onMouseDown={handleMouseDown}
        data-testid="scrubber-track"
      >
        {/* Progress fill */}
        <div
          className="absolute h-full bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full"
          style={{ width: `${progress}%` }}
        />

        {/* Scrubber handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg
                     border-2 border-cyan-400 cursor-grab active:cursor-grabbing pointer-events-none"
          style={{ left: `calc(${progress}% - 10px)` }}
        />

        {/* Hour markers */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className={`w-px ${i % 6 === 0 ? 'h-2 bg-gray-500' : 'h-1 bg-gray-600'}`}
              style={{ marginTop: i % 6 === 0 ? '4px' : '6px' }}
            />
          ))}
        </div>
      </div>

      {/* Hour labels */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>0</span>
        <span>6</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
      </div>
    </div>
  );
}
