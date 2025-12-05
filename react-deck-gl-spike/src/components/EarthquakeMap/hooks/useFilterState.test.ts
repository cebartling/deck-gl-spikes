import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilterState } from './useFilterState';

describe('useFilterState', () => {
  it('returns initial filter state with null dates', () => {
    const { result } = renderHook(() => useFilterState());

    expect(result.current.filters.dateRange).toEqual({
      startDate: null,
      endDate: null,
    });
  });

  it('setDateRange updates date range', () => {
    const { result } = renderHook(() => useFilterState());

    const startDate = new Date('2024-06-01');
    const endDate = new Date('2024-06-15');

    act(() => {
      result.current.setDateRange({ startDate, endDate });
    });

    expect(result.current.filters.dateRange).toEqual({
      startDate,
      endDate,
    });
  });

  it('setDateRange can set only start date', () => {
    const { result } = renderHook(() => useFilterState());

    const startDate = new Date('2024-06-01');

    act(() => {
      result.current.setDateRange({ startDate, endDate: null });
    });

    expect(result.current.filters.dateRange).toEqual({
      startDate,
      endDate: null,
    });
  });

  it('setDateRange can set only end date', () => {
    const { result } = renderHook(() => useFilterState());

    const endDate = new Date('2024-06-15');

    act(() => {
      result.current.setDateRange({ startDate: null, endDate });
    });

    expect(result.current.filters.dateRange).toEqual({
      startDate: null,
      endDate,
    });
  });

  it('resetFilters returns to initial state', () => {
    const { result } = renderHook(() => useFilterState());

    // First, set some filters
    act(() => {
      result.current.setDateRange({
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-15'),
      });
    });

    // Verify filters are set
    expect(result.current.filters.dateRange.startDate).not.toBeNull();

    // Reset filters
    act(() => {
      result.current.resetFilters();
    });

    // Verify filters are back to initial state
    expect(result.current.filters.dateRange).toEqual({
      startDate: null,
      endDate: null,
    });
  });

  it('setDateRange callback is stable across renders', () => {
    const { result, rerender } = renderHook(() => useFilterState());

    const firstSetDateRange = result.current.setDateRange;
    rerender();
    const secondSetDateRange = result.current.setDateRange;

    expect(firstSetDateRange).toBe(secondSetDateRange);
  });

  it('resetFilters callback is stable across renders', () => {
    const { result, rerender } = renderHook(() => useFilterState());

    const firstResetFilters = result.current.resetFilters;
    rerender();
    const secondResetFilters = result.current.resetFilters;

    expect(firstResetFilters).toBe(secondResetFilters);
  });

  it('multiple setDateRange calls work correctly', () => {
    const { result } = renderHook(() => useFilterState());

    // First update
    act(() => {
      result.current.setDateRange({
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      });
    });

    expect(result.current.filters.dateRange.startDate).toEqual(
      new Date('2024-01-01')
    );

    // Second update
    act(() => {
      result.current.setDateRange({
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-30'),
      });
    });

    expect(result.current.filters.dateRange.startDate).toEqual(
      new Date('2024-06-01')
    );
    expect(result.current.filters.dateRange.endDate).toEqual(
      new Date('2024-06-30')
    );
  });
});
