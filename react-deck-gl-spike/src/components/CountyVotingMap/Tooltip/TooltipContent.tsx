import type { CountyVoting } from '../../../types/county';
import { formatNumber, formatPercent } from '../../../utils/formatters';
import { getVotingColor } from '../layers/votingColorScale';

interface TooltipContentProps {
  county: CountyVoting;
}

function getMarginColorCSS(marginPercent: number): string {
  const [r, g, b] = getVotingColor(marginPercent);
  return `rgb(${r}, ${g}, ${b})`;
}

export function TooltipContent({ county }: TooltipContentProps) {
  const winnerParty = county.margin > 0 ? 'Democrat' : 'Republican';
  const winnerColor = county.margin > 0 ? 'text-blue-400' : 'text-red-400';
  const marginColor = getMarginColorCSS(county.marginPercent);

  return (
    <div className="space-y-2" data-testid="tooltip-content">
      {/* Color indicator bar */}
      <div
        className="h-1 w-full rounded-full"
        style={{ backgroundColor: marginColor }}
        data-testid="margin-color-indicator"
      />

      {/* Header: County Name */}
      <div>
        <div
          className="text-lg font-bold text-gray-100"
          data-testid="county-name"
        >
          {county.name}
        </div>
        <div className="text-sm text-gray-400" data-testid="county-state">
          {county.state}
        </div>
      </div>

      {/* Vote Totals */}
      <div
        className="space-y-1 border-t border-white/10 pt-2"
        data-testid="vote-totals"
      >
        <div className="flex justify-between text-sm">
          <span className="text-blue-400">Democrat</span>
          <span className="text-gray-200" data-testid="democrat-votes">
            {formatNumber(county.democratVotes)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-red-400">Republican</span>
          <span className="text-gray-200" data-testid="republican-votes">
            {formatNumber(county.republicanVotes)}
          </span>
        </div>
        {county.otherVotes > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Other</span>
            <span className="text-gray-200" data-testid="other-votes">
              {formatNumber(county.otherVotes)}
            </span>
          </div>
        )}
      </div>

      {/* Margin */}
      <div
        className="border-t border-white/10 pt-2 space-y-1"
        data-testid="margin-section"
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Margin</span>
          <span className={`font-semibold ${winnerColor}`} data-testid="margin">
            {winnerParty} +{formatPercent(Math.abs(county.marginPercent))}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Total Votes</span>
          <span className="text-gray-200" data-testid="total-votes">
            {formatNumber(county.totalVotes)}
          </span>
        </div>
      </div>
    </div>
  );
}
