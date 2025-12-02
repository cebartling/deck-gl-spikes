import { useState, useEffect } from 'react';
import type { Earthquake } from '../../../types/earthquake';
import { TooltipContent } from './TooltipContent';
import { formatMagnitude, formatDepth, formatDateTime } from '../../../utils/formatters';

interface TooltipProps {
  earthquake: Earthquake | null;
  x: number;
  y: number;
  visible?: boolean;
}

// Transition duration in milliseconds
const TRANSITION_DURATION_MS = 150;

export function EarthquakeTooltip({
  earthquake,
  x,
  y,
  visible = true,
}: TooltipProps) {
  // Track visibility for fade animation
  const [isVisible, setIsVisible] = useState(false);
  // Keep earthquake data during fade-out animation
  const [displayData, setDisplayData] = useState<Earthquake | null>(null);
  // Keep position stable during fade-out
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (earthquake && visible) {
      // Show immediately with new data
      setDisplayData(earthquake);
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
  }, [earthquake, x, y, visible]);

  // Don't render if no data to display
  if (!displayData) return null;

  // Offset tooltip from cursor
  const offsetX = 15;
  const offsetY = -10;

  const magnitude = formatMagnitude(displayData.magnitude);
  const depth = formatDepth(displayData.depth);
  const dateTime = formatDateTime(displayData.timestamp);

  return (
    <div
      role="tooltip"
      aria-label={`Earthquake details: Magnitude ${displayData.magnitude}`}
      aria-hidden={!isVisible}
      className={`
        absolute pointer-events-none z-50
        bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-200
        min-w-[200px] max-w-[300px]
        transition-opacity duration-150
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      style={{
        left: position.x + offsetX,
        top: position.y + offsetY,
      }}
      data-testid="earthquake-tooltip"
    >
      <span className="sr-only">
        Magnitude {magnitude.value} {magnitude.descriptor} earthquake.
        Location: {displayData.location}.
        Depth: {depth.value}.
        Occurred on {dateTime.date} at {dateTime.time}.
      </span>
      <TooltipContent earthquake={displayData} />
    </div>
  );
}
