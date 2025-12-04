import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { NavDropdown } from './NavDropdown';

const mockItems = [
  { label: 'Earthquakes', to: '/earthquakes' },
  { label: 'Volcanoes', to: '/volcanoes' },
];

describe('NavDropdown', () => {
  describe('rendering', () => {
    it('renders the dropdown button with label', () => {
      render(<NavDropdown label="Spikes" items={mockItems} />);

      expect(
        screen.getByRole('button', { name: /spikes/i })
      ).toBeInTheDocument();
    });

    it('does not show dropdown menu initially', () => {
      render(<NavDropdown label="Spikes" items={mockItems} />);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('has correct aria attributes on button', () => {
      render(<NavDropdown label="Spikes" items={mockItems} />);

      const button = screen.getByRole('button', { name: /spikes/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });
  });

  describe('opening and closing', () => {
    it('opens dropdown when button is clicked', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /spikes/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('closes dropdown when button is clicked again', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      const button = screen.getByRole('button', { name: /spikes/i });
      await user.click(button);
      await user.click(button);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <NavDropdown label="Spikes" items={mockItems} />
        </div>
      );

      await user.click(screen.getByRole('button', { name: /spikes/i }));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.click(screen.getByTestId('outside'));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes dropdown when menu item is clicked', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));
      await user.click(screen.getByRole('menuitem', { name: /earthquakes/i }));

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('opens dropdown with Enter key', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      const button = screen.getByRole('button', { name: /spikes/i });
      button.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('opens dropdown with Space key', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      const button = screen.getByRole('button', { name: /spikes/i });
      button.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('opens dropdown with ArrowDown key', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      const button = screen.getByRole('button', { name: /spikes/i });
      button.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('closes dropdown with Escape key', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('navigates items with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));

      const items = screen.getAllByRole('menuitem');
      expect(items[0]).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(items[1]).toHaveFocus();
    });

    it('navigates items with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));
      await user.keyboard('{ArrowDown}');

      const items = screen.getAllByRole('menuitem');
      expect(items[1]).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(items[0]).toHaveFocus();
    });

    it('wraps navigation from last to first item', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));
      await user.keyboard('{ArrowDown}'); // Move to second item

      const items = screen.getAllByRole('menuitem');
      expect(items[1]).toHaveFocus();

      await user.keyboard('{ArrowDown}'); // Wrap to first
      expect(items[0]).toHaveFocus();
    });

    it('wraps navigation from first to last item', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));

      const items = screen.getAllByRole('menuitem');
      expect(items[0]).toHaveFocus();

      await user.keyboard('{ArrowUp}'); // Wrap to last
      expect(items[1]).toHaveFocus();
    });

    it('navigates to first item with Home key', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));
      await user.keyboard('{ArrowDown}'); // Move to second

      const items = screen.getAllByRole('menuitem');
      expect(items[1]).toHaveFocus();

      await user.keyboard('{Home}');
      expect(items[0]).toHaveFocus();
    });

    it('navigates to last item with End key', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));

      const items = screen.getAllByRole('menuitem');
      expect(items[0]).toHaveFocus();

      await user.keyboard('{End}');
      expect(items[1]).toHaveFocus();
    });
  });

  describe('menu items', () => {
    it('renders all menu items as links', async () => {
      const user = userEvent.setup();
      render(<NavDropdown label="Spikes" items={mockItems} />);

      await user.click(screen.getByRole('button', { name: /spikes/i }));

      const earthquakesLink = screen.getByRole('menuitem', {
        name: /earthquakes/i,
      });
      const volcanoesLink = screen.getByRole('menuitem', {
        name: /volcanoes/i,
      });

      expect(earthquakesLink).toHaveAttribute('href', '/earthquakes');
      expect(volcanoesLink).toHaveAttribute('href', '/volcanoes');
    });
  });

  describe('active state', () => {
    it('highlights button when a dropdown item route is active', () => {
      render(<NavDropdown label="Spikes" items={mockItems} />, {
        route: '/earthquakes',
      });

      const button = screen.getByRole('button', { name: /spikes/i });
      expect(button).toHaveClass('bg-gray-700', 'text-white');
    });

    it('does not highlight button when no dropdown item route is active', () => {
      render(<NavDropdown label="Spikes" items={mockItems} />, { route: '/' });

      const button = screen.getByRole('button', { name: /spikes/i });
      expect(button).toHaveClass('text-gray-300');
      expect(button).not.toHaveClass('bg-gray-700');
    });
  });
});
