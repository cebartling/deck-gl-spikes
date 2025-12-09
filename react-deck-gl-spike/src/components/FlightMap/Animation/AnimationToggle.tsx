import { useFlightAnimationStore } from '../../../stores/flightAnimationStore';

export function AnimationToggle() {
  const animationEnabled = useFlightAnimationStore(
    (state) => state.animationEnabled
  );
  const setAnimationEnabled = useFlightAnimationStore(
    (state) => state.setAnimationEnabled
  );

  return (
    <div
      className="bg-gray-900/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/10"
      data-testid="animation-toggle"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Flight Animation</h3>
          <p className="text-gray-400 text-xs mt-1">
            Watch flights throughout the day
          </p>
        </div>

        <button
          onClick={() => setAnimationEnabled(!animationEnabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            animationEnabled ? 'bg-cyan-600' : 'bg-gray-600'
          }`}
          role="switch"
          aria-checked={animationEnabled}
          aria-label="Toggle flight animation"
        >
          <span
            className={`absolute left-0 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              animationEnabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
