import { getVotingColor } from '../layers/votingColorScale';

// Legend gradient steps from Republican to Democrat
const LEGEND_STEPS = [-50, -25, 0, 25, 50];

const LABELS = {
  republican: 'Republican',
  democrat: 'Democrat',
  repMargin: 'R +50%',
  demMargin: 'D +50%',
} as const;

export function VotingLegend() {
  return (
    <div
      className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/10 z-10"
      role="region"
      aria-labelledby="voting-legend-title"
    >
      <h4
        id="voting-legend-title"
        className="text-sm font-semibold mb-2 text-gray-100"
      >
        Vote Margin
      </h4>

      <div className="flex flex-col gap-1">
        {/* Color gradient bar */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-300 w-10">{LABELS.repMargin}</span>
          <div
            className="flex h-4 rounded overflow-hidden"
            role="img"
            aria-label="Color gradient from red (Republican) to blue (Democrat)"
          >
            {LEGEND_STEPS.map((margin, i) => {
              const [r, g, b] = getVotingColor(margin);
              return (
                <div
                  key={i}
                  className="w-8 h-full"
                  style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                />
              );
            })}
          </div>
          <span className="text-xs text-gray-300 w-10 text-right">
            {LABELS.demMargin}
          </span>
        </div>

        {/* Party labels */}
        <div className="flex justify-between text-xs text-gray-400 px-10">
          <span>{LABELS.republican}</span>
          <span>{LABELS.democrat}</span>
        </div>
      </div>
    </div>
  );
}
