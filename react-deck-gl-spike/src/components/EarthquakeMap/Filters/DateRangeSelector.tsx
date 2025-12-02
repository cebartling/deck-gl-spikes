import { useCallback } from 'react';
import type { DateRange } from '../../../types/filters';

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
}

const PRESETS = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: 'All', days: null },
] as const;

function formatDateForInput(date: Date | null | undefined): string {
  if (!date || isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

function isPresetActive(value: DateRange, days: number | null): boolean {
  if (days === null) {
    return value.startDate === null && value.endDate === null;
  }
  if (!value.startDate || !value.endDate) return false;

  const now = new Date();
  const expectedStart = new Date();
  expectedStart.setDate(now.getDate() - days);
  expectedStart.setHours(0, 0, 0, 0);

  const startMatch =
    Math.abs(value.startDate.getTime() - expectedStart.getTime()) < 86400000;
  const endMatch = Math.abs(value.endDate.getTime() - now.getTime()) < 86400000;

  return startMatch && endMatch;
}

export function DateRangeSelector({
  value,
  onChange,
  minDate,
  maxDate,
}: DateRangeSelectorProps) {
  const handleStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value ? new Date(e.target.value + 'T00:00:00') : null;
      onChange({ ...value, startDate: date });
    },
    [value, onChange]
  );

  const handleEndChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value ? new Date(e.target.value + 'T23:59:59') : null;
      onChange({ ...value, endDate: date });
    },
    [value, onChange]
  );

  const handlePresetClick = useCallback(
    (days: number | null) => {
      if (days === null) {
        onChange({ startDate: null, endDate: null });
      } else {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        start.setHours(0, 0, 0, 0);
        onChange({ startDate: start, endDate: end });
      }
    },
    [onChange]
  );

  return (
    <div
      role="group"
      aria-labelledby="date-range-label"
      className="flex flex-col gap-2 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow"
      data-testid="date-range-selector"
    >
      <span id="date-range-label" className="text-sm font-semibold text-gray-700">
        Time Period
      </span>

      <div className="flex gap-1" role="group" aria-label="Quick date presets">
        {PRESETS.map(({ label, days }) => (
          <button
            key={label}
            type="button"
            onClick={() => handlePresetClick(days)}
            aria-pressed={isPresetActive(value, days)}
            className={`
              px-2 py-1 text-xs rounded transition-colors
              ${
                isPresetActive(value, days)
                  ? 'bg-blue-200 text-blue-900 font-semibold'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
            data-testid={`preset-${label.toLowerCase()}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500" htmlFor="start-date">
            From
          </label>
          <input
            id="start-date"
            type="date"
            value={formatDateForInput(value.startDate)}
            onChange={handleStartChange}
            min={minDate ? formatDateForInput(minDate) : undefined}
            max={formatDateForInput(value.endDate || maxDate || new Date())}
            className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-describedby="date-range-help"
            data-testid="start-date-input"
          />
        </div>

        <div className="flex-1">
          <label className="text-xs text-gray-500" htmlFor="end-date">
            To
          </label>
          <input
            id="end-date"
            type="date"
            value={formatDateForInput(value.endDate)}
            onChange={handleEndChange}
            min={formatDateForInput(value.startDate || minDate)}
            max={maxDate ? formatDateForInput(maxDate) : formatDateForInput(new Date())}
            className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            data-testid="end-date-input"
          />
        </div>
      </div>

      <span id="date-range-help" className="sr-only">
        Select start and end dates to filter displayed earthquakes
      </span>
    </div>
  );
}
