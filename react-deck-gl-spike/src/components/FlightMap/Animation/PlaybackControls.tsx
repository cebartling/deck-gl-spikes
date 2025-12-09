import { useFlightAnimationStore } from '../../../stores/flightAnimationStore';

const SPEED_OPTIONS = [
  { value: 120, label: '120x' },
  { value: 300, label: '300x' },
  { value: 1000, label: '1000x' },
  { value: 3000, label: '3000x' },
];

export function PlaybackControls() {
  const isPlaying = useFlightAnimationStore((state) => state.isPlaying);
  const togglePlayback = useFlightAnimationStore(
    (state) => state.togglePlayback
  );
  const playbackSpeed = useFlightAnimationStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useFlightAnimationStore(
    (state) => state.setPlaybackSpeed
  );
  const loopEnabled = useFlightAnimationStore((state) => state.loopEnabled);
  const setLoopEnabled = useFlightAnimationStore(
    (state) => state.setLoopEnabled
  );
  const setCurrentTime = useFlightAnimationStore(
    (state) => state.setCurrentTime
  );

  return (
    <div
      className="flex items-center justify-center gap-3 bg-gray-900/90 backdrop-blur-md rounded-lg px-4 py-2 shadow-lg border border-white/10"
      data-testid="playback-controls"
    >
      {/* Reset button */}
      <button
        onClick={() => setCurrentTime(0)}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white
                   hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Reset to midnight"
        title="Reset to midnight"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Play/Pause button */}
      <button
        onClick={togglePlayback}
        className="w-12 h-12 flex items-center justify-center bg-cyan-600 hover:bg-cyan-500
                   text-white rounded-full transition-colors shadow-lg"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        data-testid="play-pause-button"
      >
        {isPlaying ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 9v6m4-6v6"
            />
          </svg>
        ) : (
          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Speed selector */}
      <div className="flex items-center gap-1" data-testid="speed-selector">
        {SPEED_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPlaybackSpeed(value)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              playbackSpeed === value
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            aria-label={`Set speed to ${label}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loop toggle */}
      <button
        onClick={() => setLoopEnabled(!loopEnabled)}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          loopEnabled
            ? 'bg-cyan-600 text-white'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
        }`}
        aria-label={loopEnabled ? 'Loop enabled' : 'Loop disabled'}
        title={loopEnabled ? 'Loop enabled' : 'Loop disabled'}
        data-testid="loop-toggle"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
}
