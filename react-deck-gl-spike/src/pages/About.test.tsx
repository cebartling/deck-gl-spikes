import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import About from './About';

describe('About', () => {
  it('renders the heading', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'About'
    );
  });

  it('renders the project description', () => {
    render(<About />);

    expect(
      screen.getByText(/react \+ typescript spike project/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/deck\.gl visualization library/i)).toBeInTheDocument();
  });

  it('renders the navigation link to Home page', () => {
    render(<About />);

    const link = screen.getByRole('link', { name: /go to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
