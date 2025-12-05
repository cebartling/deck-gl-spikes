import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MidtermYearSelector } from './MidtermYearSelector';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';
import { MIDTERM_YEARS, MIDTERM_YEAR_INFO } from '../../../types/midterm';

describe('MidtermYearSelector', () => {
  beforeEach(() => {
    useCountyFilterStore.getState().reset();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<MidtermYearSelector />);
      expect(screen.getByLabelText('Midterm Year')).toBeInTheDocument();
    });

    it('should render all midterm year options', () => {
      render(<MidtermYearSelector />);
      const select = screen.getByRole('combobox');

      for (const year of MIDTERM_YEARS) {
        expect(select).toHaveTextContent(year.toString());
      }
    });

    it('should show descriptions in options', () => {
      render(<MidtermYearSelector />);
      const select = screen.getByRole('combobox');

      for (const year of MIDTERM_YEARS) {
        expect(select).toHaveTextContent(MIDTERM_YEAR_INFO[year].description);
      }
    });
  });

  describe('initial state', () => {
    it('should show 2022 as the initially selected year', () => {
      render(<MidtermYearSelector />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('2022');
    });
  });

  describe('interaction', () => {
    it('should update store when a different year is selected', async () => {
      const user = userEvent.setup();
      render(<MidtermYearSelector />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '2018');

      expect(useCountyFilterStore.getState().selectedMidtermYear).toBe(2018);
    });

    it('should allow selecting any valid midterm year', async () => {
      const user = userEvent.setup();
      render(<MidtermYearSelector />);

      const select = screen.getByRole('combobox');

      for (const year of MIDTERM_YEARS) {
        await user.selectOptions(select, year.toString());
        expect(useCountyFilterStore.getState().selectedMidtermYear).toBe(year);
      }
    });

    it('should reflect store changes in the UI', async () => {
      const user = userEvent.setup();
      render(<MidtermYearSelector />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;

      await user.selectOptions(select, '2014');
      expect(select.value).toBe('2014');

      await user.selectOptions(select, '2010');
      expect(select.value).toBe('2010');
    });
  });

  describe('accessibility', () => {
    it('should have a proper label', () => {
      render(<MidtermYearSelector />);
      const label = screen.getByText('Midterm Year');
      expect(label).toHaveAttribute('for', 'midterm-year-selector');
    });

    it('should have the correct id on the select', () => {
      render(<MidtermYearSelector />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'midterm-year-selector');
    });
  });
});
