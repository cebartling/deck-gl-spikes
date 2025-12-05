import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ElectionTypeSelector } from './ElectionTypeSelector';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';
import { ELECTION_TYPES } from '../../../types/electionType';

describe('ElectionTypeSelector', () => {
  beforeEach(() => {
    useCountyFilterStore.getState().reset();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<ElectionTypeSelector />);
      expect(screen.getByLabelText('Election Type')).toBeInTheDocument();
    });

    it('should render all election type options', () => {
      render(<ElectionTypeSelector />);
      const select = screen.getByRole('combobox');

      for (const type of ELECTION_TYPES) {
        expect(select).toHaveTextContent(type.label);
      }
    });

    it('should show descriptions in options', () => {
      render(<ElectionTypeSelector />);
      const select = screen.getByRole('combobox');

      for (const type of ELECTION_TYPES) {
        expect(select).toHaveTextContent(type.description);
      }
    });
  });

  describe('initial state', () => {
    it('should show presidential as the initially selected type', () => {
      render(<ElectionTypeSelector />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('presidential');
    });
  });

  describe('interaction', () => {
    it('should update store when midterm is selected', async () => {
      const user = userEvent.setup();
      render(<ElectionTypeSelector />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'midterm');

      expect(useCountyFilterStore.getState().electionType).toBe('midterm');
    });

    it('should allow switching back to presidential', async () => {
      const user = userEvent.setup();
      render(<ElectionTypeSelector />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'midterm');
      await user.selectOptions(select, 'presidential');

      expect(useCountyFilterStore.getState().electionType).toBe('presidential');
    });

    it('should reflect store changes in the UI', async () => {
      const user = userEvent.setup();
      render(<ElectionTypeSelector />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;

      await user.selectOptions(select, 'midterm');
      expect(select.value).toBe('midterm');

      await user.selectOptions(select, 'presidential');
      expect(select.value).toBe('presidential');
    });
  });

  describe('accessibility', () => {
    it('should have a proper label', () => {
      render(<ElectionTypeSelector />);
      const label = screen.getByText('Election Type');
      expect(label).toHaveAttribute('for', 'election-type-selector');
    });

    it('should have the correct id on the select', () => {
      render(<ElectionTypeSelector />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'election-type-selector');
    });
  });
});
