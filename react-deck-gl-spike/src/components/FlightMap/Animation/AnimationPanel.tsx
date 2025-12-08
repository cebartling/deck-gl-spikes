import { TimelineScrubber } from './TimelineScrubber';
import { PlaybackControls } from './PlaybackControls';

interface AnimationPanelProps {
  activeFlightCount: number;
}

export function AnimationPanel({ activeFlightCount }: AnimationPanelProps) {
  return (
    <div
      className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px]
                  flex flex-col gap-3 z-20"
      data-testid="animation-panel"
    >
      {/* Flight count indicator */}
      <div
        className="bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg
                    flex items-center justify-between"
      >
        <span className="text-gray-400 text-sm">Active Flights</span>
        <span
          className="text-white font-mono text-lg"
          data-testid="active-flight-count"
        >
          {activeFlightCount}
        </span>
      </div>

      {/* Timeline scrubber */}
      <TimelineScrubber />

      {/* Playback controls */}
      <div className="flex justify-center">
        <PlaybackControls />
      </div>
    </div>
  );
}
