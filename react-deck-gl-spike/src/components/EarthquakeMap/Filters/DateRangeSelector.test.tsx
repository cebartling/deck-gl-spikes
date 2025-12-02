import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangeSelector } from './DateRangeSelector';
import type { DateRange } from '../../../types/filters';

describe('DateRangeSelector', () => {
  const mockOnChange = vi.fn();
  const defaultValue: DateRange = { startDate: null, endDate: null };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders start and end date inputs', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
  });

  it('renders Time Period label', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    expect(screen.getByText('Time Period')).toBeInTheDocument();
  });

  it('renders with data-testid', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    expect(screen.getByTestId('date-range-selector')).toBeInTheDocument();
  });

  it('calls onChange when start date changes', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    const startInput = screen.getByTestId('start-date-input');
    fireEvent.change(startInput, { target: { value: '2024-06-01' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: new Date('2024-06-01T00:00:00'),
      endDate: null,
    });
  });

  it('calls onChange when end date changes', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    const endInput = screen.getByTestId('end-date-input');
    fireEvent.change(endInput, { target: { value: '2024-06-30' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: null,
      endDate: new Date('2024-06-30T23:59:59'),
    });
  });

  it('clears start date when input is cleared', () => {
    const value: DateRange = {
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-15'),
    };

    render(<DateRangeSelector value={value} onChange={mockOnChange} />);

    const startInput = screen.getByTestId('start-date-input');
    fireEvent.change(startInput, { target: { value: '' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: null,
      endDate: new Date('2024-06-15'),
    });
  });

  it('formats dates correctly for input values', () => {
    const value: DateRange = {
      startDate: new Date('2024-06-01T00:00:00Z'),
      endDate: new Date('2024-06-15T23:59:59Z'),
    };

    render(<DateRangeSelector value={value} onChange={mockOnChange} />);

    const startInput = screen.getByTestId('start-date-input') as HTMLInputElement;
    const endInput = screen.getByTestId('end-date-input') as HTMLInputElement;

    expect(startInput.value).toBe('2024-06-01');
    expect(endInput.value).toBe('2024-06-15');
  });

  it('respects minDate constraint on start date input', () => {
    const minDate = new Date('2024-01-01');

    render(
      <DateRangeSelector value={defaultValue} onChange={mockOnChange} minDate={minDate} />
    );

    const startInput = screen.getByTestId('start-date-input');
    expect(startInput).toHaveAttribute('min', '2024-01-01');
  });

  it('respects maxDate constraint on end date input', () => {
    const maxDate = new Date('2024-12-31');

    render(
      <DateRangeSelector value={defaultValue} onChange={mockOnChange} maxDate={maxDate} />
    );

    const endInput = screen.getByTestId('end-date-input');
    expect(endInput).toHaveAttribute('max', '2024-12-31');
  });

  it('start date max is constrained by end date', () => {
    const value: DateRange = {
      startDate: null,
      endDate: new Date('2024-06-15'),
    };

    render(<DateRangeSelector value={value} onChange={mockOnChange} />);

    const startInput = screen.getByTestId('start-date-input');
    expect(startInput).toHaveAttribute('max', '2024-06-15');
  });

  it('end date min is constrained by start date', () => {
    const value: DateRange = {
      startDate: new Date('2024-06-01'),
      endDate: null,
    };

    render(<DateRangeSelector value={value} onChange={mockOnChange} />);

    const endInput = screen.getByTestId('end-date-input');
    expect(endInput).toHaveAttribute('min', '2024-06-01');
  });

  it('has accessible group role', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    const group = screen.getByRole('group', { name: 'Time Period' });
    expect(group).toBeInTheDocument();
  });

  it('has screen reader help text', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    expect(
      screen.getByText('Select start and end dates to filter displayed earthquakes')
    ).toHaveClass('sr-only');
  });
});

describe('DateRangeSelector presets', () => {
  const mockOnChange = vi.fn();
  const defaultValue: DateRange = { startDate: null, endDate: null };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders all preset buttons', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    expect(screen.getByTestId('preset-24h')).toBeInTheDocument();
    expect(screen.getByTestId('preset-7d')).toBeInTheDocument();
    expect(screen.getByTestId('preset-30d')).toBeInTheDocument();
    expect(screen.getByTestId('preset-all')).toBeInTheDocument();
  });

  it('clicking 24h preset sets date range to last 24 hours', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    fireEvent.click(screen.getByTestId('preset-24h'));

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: new Date('2024-06-14T00:00:00'),
      endDate: new Date('2024-06-15T12:00:00Z'),
    });
  });

  it('clicking 7d preset sets date range to last 7 days', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    fireEvent.click(screen.getByTestId('preset-7d'));

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: new Date('2024-06-08T00:00:00'),
      endDate: new Date('2024-06-15T12:00:00Z'),
    });
  });

  it('clicking 30d preset sets date range to last 30 days', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    fireEvent.click(screen.getByTestId('preset-30d'));

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: new Date('2024-05-16T00:00:00'),
      endDate: new Date('2024-06-15T12:00:00Z'),
    });
  });

  it('clicking All preset clears both dates', () => {
    const value: DateRange = {
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-15'),
    };

    render(<DateRangeSelector value={value} onChange={mockOnChange} />);

    fireEvent.click(screen.getByTestId('preset-all'));

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: null,
      endDate: null,
    });
  });

  it('All preset is highlighted when no dates are set', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    const allButton = screen.getByTestId('preset-all');
    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(allButton).toHaveClass('bg-blue-500');
  });

  it('preset buttons have aria-pressed attribute', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    const buttons = ['preset-24h', 'preset-7d', 'preset-30d', 'preset-all'];
    buttons.forEach((testId) => {
      expect(screen.getByTestId(testId)).toHaveAttribute('aria-pressed');
    });
  });

  it('preset is active when dates match the range', () => {
    const now = new Date('2024-06-15T12:00:00Z');
    const sevenDaysAgo = new Date('2024-06-08T00:00:00');

    const value: DateRange = {
      startDate: sevenDaysAgo,
      endDate: now,
    };

    render(<DateRangeSelector value={value} onChange={mockOnChange} />);

    const sevenDayButton = screen.getByTestId('preset-7d');
    expect(sevenDayButton).toHaveAttribute('aria-pressed', 'true');
    expect(sevenDayButton).toHaveClass('bg-blue-500');
  });

  it('preset group has accessible label', () => {
    render(<DateRangeSelector value={defaultValue} onChange={mockOnChange} />);

    const presetGroup = screen.getByRole('group', { name: 'Quick date presets' });
    expect(presetGroup).toBeInTheDocument();
  });
});
