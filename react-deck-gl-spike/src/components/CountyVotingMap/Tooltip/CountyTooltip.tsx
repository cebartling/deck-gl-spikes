import { useState, useEffect } from 'react';
import type { CountyVoting } from '../../../types/county';
import { TooltipContent } from './TooltipContent';
import { formatPercent } from '../../../utils/formatters';

interface CountyTooltipProps {
  county: CountyVoting | null;
  x: number;
  y: number;
  visible?: boolean;
}

// Transition duration in milliseconds
const TRANSITION_DURATION_MS = 150;

export function CountyTooltip({
  county,
  x,
  y,
  visible = true,
}: CountyTooltipProps) {
  // Track visibility for fade animation
  const [isVisible, setIsVisible] = useState(false);
  // Keep county data during fade-out animation
  const [displayData, setDisplayData] = useState<CountyVoting | null>(null);
  // Keep position stable during fade-out
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (county && visible) {
      // Show immediately with new data
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayData(county);
      setPosition({ x, y });
      setIsVisible(true);
    } else {
      // Start fade out
      setIsVisible(false);
      // Clear data after transition completes
      const timer = setTimeout(() => {
        setDisplayData(null);
      }, TRANSITION_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [county, x, y, visible]);

  // Don't render if no data to display
  if (!displayData) return null;

  // Offset tooltip from cursor
  const offsetX = 15;
  const offsetY = -10;

  const winnerParty = displayData.margin > 0 ? 'Democrat' : 'Republican';

  return (
    <div
      role="tooltip"
      aria-label={`${displayData.name}, ${displayData.state}: ${winnerParty} +${formatPercent(displayData.marginPercent)}`}
      aria-hidden={!isVisible}
      className={`
        absolute pointer-events-none z-50
        bg-gray-900/90 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-white/10
        min-w-[220px] max-w-[300px]
        transition-opacity duration-150
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      style={{
        left: position.x + offsetX,
        top: position.y + offsetY,
      }}
      data-testid="county-tooltip"
    >
      <span className="sr-only">
        {displayData.name}, {displayData.state}.
        {winnerParty} margin of {formatPercent(displayData.marginPercent)}.
        Total votes: {displayData.totalVotes}.
      </span>
      <TooltipContent county={displayData} />
    </div>
  );
}
