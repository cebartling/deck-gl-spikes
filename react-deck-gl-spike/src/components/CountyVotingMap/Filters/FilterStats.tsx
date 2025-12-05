import { formatNumber, formatPercent } from '../../../utils/formatters';
import type { FilterStats as FilterStatsType } from '../hooks/useFilteredCounties';

interface FilterStatsProps {
  stats: FilterStatsType | null;
  isFiltered: boolean;
  stateName?: string;
}

export function FilterStats({ stats, isFiltered, stateName }: FilterStatsProps) {
  if (!stats) return null;

  const winnerParty = stats.overallMargin > 0 ? 'Democrat' : 'Republican';
  const winnerColor =
    stats.overallMargin > 0 ? 'text-blue-400' : 'text-red-400';
  const marginSign = stats.overallMargin > 0 ? '+' : '';

  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/10">
      <h3 className="text-white text-sm font-medium mb-2">
        {isFiltered ? stateName : 'National'} Summary
      </h3>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Counties</span>
          <span className="text-white font-medium">
            {formatNumber(stats.countyCount)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Total Votes</span>
          <span className="text-white font-medium">
            {formatNumber(stats.totalVotes)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-blue-400">Democrat</span>
          <span className="text-blue-400 font-medium">
            {formatNumber(stats.democratVotes)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-red-400">Republican</span>
          <span className="text-red-400 font-medium">
            {formatNumber(stats.republicanVotes)}
          </span>
        </div>

        {stats.totalVotes > 0 && (
          <div className="flex justify-between pt-1.5 border-t border-gray-700">
            <span className="text-gray-400">Overall Margin</span>
            <span className={`${winnerColor} font-medium`}>
              {winnerParty} {marginSign}
              {formatPercent(Math.abs(stats.overallMargin))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
