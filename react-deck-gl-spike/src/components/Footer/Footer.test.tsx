import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the footer element', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders copyright text with Pintail Consulting LLC', () => {
    render(<Footer />);

    expect(screen.getByText(/Pintail Consulting LLC/i)).toBeInTheDocument();
  });

  it('renders the current year in copyright', () => {
    render(<Footer />);

    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it('renders all rights reserved text', () => {
    render(<Footer />);

    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });
});
