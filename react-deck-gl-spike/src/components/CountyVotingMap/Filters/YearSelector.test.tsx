import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YearSelector } from './YearSelector';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';
import { ELECTION_YEARS, ELECTION_YEAR_INFO } from '../../../types/election';

describe('YearSelector', () => {
  beforeEach(() => {
    useCountyFilterStore.getState().reset();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<YearSelector />);
      expect(screen.getByLabelText('Presidential Year')).toBeInTheDocument();
    });

    it('should render all election year options', () => {
      render(<YearSelector />);
      const select = screen.getByRole('combobox');

      for (const year of ELECTION_YEARS) {
        expect(select).toHaveTextContent(year.toString());
      }
    });

    it('should show candidate descriptions in options', () => {
      render(<YearSelector />);
      const select = screen.getByRole('combobox');

      for (const year of ELECTION_YEARS) {
        expect(select).toHaveTextContent(ELECTION_YEAR_INFO[year].description);
      }
    });
  });

  describe('initial state', () => {
    it('should show 2024 as the initially selected year', () => {
      render(<YearSelector />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('2024');
    });
  });

  describe('interaction', () => {
    it('should update store when a different year is selected', async () => {
      const user = userEvent.setup();
      render(<YearSelector />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '2020');

      expect(useCountyFilterStore.getState().selectedPresidentialYear).toBe(
        2020
      );
    });

    it('should allow selecting any valid election year', async () => {
      const user = userEvent.setup();
      render(<YearSelector />);

      const select = screen.getByRole('combobox');

      for (const year of ELECTION_YEARS) {
        await user.selectOptions(select, year.toString());
        expect(useCountyFilterStore.getState().selectedPresidentialYear).toBe(
          year
        );
      }
    });

    it('should reflect store changes in the UI', async () => {
      const user = userEvent.setup();
      render(<YearSelector />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;

      await user.selectOptions(select, '2016');
      expect(select.value).toBe('2016');

      await user.selectOptions(select, '2008');
      expect(select.value).toBe('2008');
    });
  });

  describe('accessibility', () => {
    it('should have a proper label', () => {
      render(<YearSelector />);
      const label = screen.getByText('Presidential Year');
      expect(label).toHaveAttribute('for', 'year-selector');
    });

    it('should have the correct id on the select', () => {
      render(<YearSelector />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'year-selector');
    });
  });
});
