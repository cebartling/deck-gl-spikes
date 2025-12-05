import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StateSelector } from './StateSelector';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';
import { useCountyVotingViewStore } from '../../../stores/countyVotingViewStore';
import { US_STATES } from '../../../types/states';

describe('StateSelector', () => {
  beforeEach(() => {
    useCountyFilterStore.getState().reset();
    useCountyVotingViewStore.getState().resetView();
  });

  describe('rendering', () => {
    it('should render the label', () => {
      render(<StateSelector />);
      expect(screen.getByText('Filter by State')).toBeInTheDocument();
    });

    it('should render a select element', () => {
      render(<StateSelector />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render "All States" as the first option', () => {
      render(<StateSelector />);
      const select = screen.getByRole('combobox');
      const options = select.querySelectorAll('option');
      expect(options[0]).toHaveTextContent('All States');
      expect(options[0]).toHaveValue('');
    });

    it('should render all 51 state options (50 states + DC)', () => {
      render(<StateSelector />);
      const select = screen.getByRole('combobox');
      const options = select.querySelectorAll('option');
      // 51 states + 1 "All States" option
      expect(options).toHaveLength(52);
    });

    it('should render states with correct FIPS values', () => {
      render(<StateSelector />);
      const californiaOption = screen.getByRole('option', {
        name: 'California',
      });
      expect(californiaOption).toHaveValue('06');

      const texasOption = screen.getByRole('option', { name: 'Texas' });
      expect(texasOption).toHaveValue('48');
    });

    it('should render all state names from US_STATES', () => {
      render(<StateSelector />);
      US_STATES.forEach((state) => {
        expect(
          screen.getByRole('option', { name: state.name })
        ).toBeInTheDocument();
      });
    });
  });

  describe('selection', () => {
    it('should show "All States" selected by default', () => {
      render(<StateSelector />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('');
    });

    it('should update store when a state is selected', async () => {
      const user = userEvent.setup();
      render(<StateSelector />);

      await user.selectOptions(screen.getByRole('combobox'), '06');
      expect(useCountyFilterStore.getState().selectedState).toBe('06');
    });

    it('should update store to null when "All States" is selected', async () => {
      const user = userEvent.setup();
      useCountyFilterStore.getState().setSelectedState('06');
      render(<StateSelector />);

      await user.selectOptions(screen.getByRole('combobox'), '');
      expect(useCountyFilterStore.getState().selectedState).toBeNull();
    });

    it('should reflect current filter state in selection', () => {
      useCountyFilterStore.getState().setSelectedState('48');
      render(<StateSelector />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('48');
    });
  });

  describe('map view interactions', () => {
    it('should call flyTo when a state is selected', async () => {
      const user = userEvent.setup();
      const flyToSpy = vi.spyOn(useCountyVotingViewStore.getState(), 'flyTo');

      render(<StateSelector />);
      await user.selectOptions(screen.getByRole('combobox'), '06');

      expect(flyToSpy).toHaveBeenCalled();
      flyToSpy.mockRestore();
    });

    it('should call resetView when "All States" is selected', async () => {
      const user = userEvent.setup();
      useCountyFilterStore.getState().setSelectedState('06');
      const resetViewSpy = vi.spyOn(
        useCountyVotingViewStore.getState(),
        'resetView'
      );

      render(<StateSelector />);
      await user.selectOptions(screen.getByRole('combobox'), '');

      expect(resetViewSpy).toHaveBeenCalled();
      resetViewSpy.mockRestore();
    });
  });
});
