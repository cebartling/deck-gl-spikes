import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapContainer } from './MapContainer';

describe('MapContainer', () => {
  it('renders children', () => {
    render(
      <MapContainer>
        <div data-testid="child-content">Test Content</div>
      </MapContainer>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies full-width class', () => {
    render(
      <MapContainer>
        <div>Content</div>
      </MapContainer>
    );

    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('w-full');
  });

  it('applies full-height class', () => {
    render(
      <MapContainer>
        <div>Content</div>
      </MapContainer>
    );

    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('h-full');
  });

  it('applies minimum height classes for responsiveness', () => {
    render(
      <MapContainer>
        <div>Content</div>
      </MapContainer>
    );

    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('min-h-[400px]');
    expect(container).toHaveClass('md:min-h-[600px]');
  });
});
