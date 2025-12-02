import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ZoomControls } from './ZoomControls';

describe('ZoomControls', () => {
  const defaultProps = {
    onZoomIn: vi.fn(),
    onZoomOut: vi.fn(),
    onResetView: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders zoom in button', () => {
      render(<ZoomControls {...defaultProps} />);

      const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
      expect(zoomInButton).toBeInTheDocument();
      expect(zoomInButton).toHaveTextContent('+');
    });

    it('renders zoom out button', () => {
      render(<ZoomControls {...defaultProps} />);

      const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
      expect(zoomOutButton).toBeInTheDocument();
      expect(zoomOutButton).toHaveTextContent('−');
    });

    it('renders reset view button', () => {
      render(<ZoomControls {...defaultProps} />);

      const resetButton = screen.getByRole('button', { name: /reset view/i });
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveTextContent('⌂');
    });

    it('renders all three buttons', () => {
      render(<ZoomControls {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });
  });

  describe('interactions', () => {
    it('calls onZoomIn when + clicked', () => {
      render(<ZoomControls {...defaultProps} />);

      const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
      fireEvent.click(zoomInButton);

      expect(defaultProps.onZoomIn).toHaveBeenCalledTimes(1);
    });

    it('calls onZoomOut when - clicked', () => {
      render(<ZoomControls {...defaultProps} />);

      const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
      fireEvent.click(zoomOutButton);

      expect(defaultProps.onZoomOut).toHaveBeenCalledTimes(1);
    });

    it('calls onResetView when reset clicked', () => {
      render(<ZoomControls {...defaultProps} />);

      const resetButton = screen.getByRole('button', { name: /reset view/i });
      fireEvent.click(resetButton);

      expect(defaultProps.onResetView).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('buttons have correct aria-labels', () => {
      render(<ZoomControls {...defaultProps} />);

      expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
      expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
      expect(screen.getByLabelText('Reset view')).toBeInTheDocument();
    });

    it('renders control group with aria-label', () => {
      render(<ZoomControls {...defaultProps} />);

      const group = screen.getByRole('group', { name: /map zoom controls/i });
      expect(group).toBeInTheDocument();
    });

    it('buttons have type="button" to prevent form submission', () => {
      render(<ZoomControls {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('styling', () => {
    it('applies positioning classes to container', () => {
      const { container } = render(<ZoomControls {...defaultProps} />);

      const controlGroup = container.querySelector('.absolute.top-4.right-4');
      expect(controlGroup).toBeInTheDocument();
    });

    it('applies touch-manipulation class to buttons for mobile', () => {
      render(<ZoomControls {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('touch-manipulation');
      });
    });
  });
});
