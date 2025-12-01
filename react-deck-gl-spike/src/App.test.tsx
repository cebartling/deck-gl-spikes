import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from './test/test-utils';
import App from './App';

describe('App', () => {
  it('renders the home page by default', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Vite + React'
    );
  });

  it('contains routes for home and about pages', () => {
    render(<App />);

    expect(screen.getByText('Go to About')).toBeInTheDocument();
  });
});
