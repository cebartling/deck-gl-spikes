import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import Home from './Home';

describe('Home', () => {
  it('renders the heading', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Vite + React'
    );
  });

  it('renders the Vite logo with correct alt text', () => {
    render(<Home />);

    expect(screen.getByAltText('Vite logo')).toBeInTheDocument();
  });

  it('renders the React logo with correct alt text', () => {
    render(<Home />);

    expect(screen.getByAltText('React logo')).toBeInTheDocument();
  });

  it('renders the counter button with initial count of 0', () => {
    render(<Home />);

    expect(
      screen.getByRole('button', { name: /count is 0/i })
    ).toBeInTheDocument();
  });

  it('increments counter when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const button = screen.getByRole('button', { name: /count is 0/i });
    await user.click(button);

    expect(
      screen.getByRole('button', { name: /count is 1/i })
    ).toBeInTheDocument();
  });

  it('increments counter multiple times', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const button = screen.getByRole('button', { name: /count is/i });
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(
      screen.getByRole('button', { name: /count is 3/i })
    ).toBeInTheDocument();
  });

  it('renders the navigation link to About page', () => {
    render(<Home />);

    const link = screen.getByRole('link', { name: /go to about/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders the HMR instruction text', () => {
    render(<Home />);

    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText('src/pages/Home.tsx')).toBeInTheDocument();
  });

  it('renders external links to Vite and React documentation', () => {
    render(<Home />);

    const viteLink = screen.getByRole('link', { name: /vite logo/i });
    const reactLink = screen.getByRole('link', { name: /react logo/i });

    expect(viteLink).toHaveAttribute('href', 'https://vite.dev');
    expect(viteLink).toHaveAttribute('target', '_blank');
    expect(reactLink).toHaveAttribute('href', 'https://react.dev');
    expect(reactLink).toHaveAttribute('target', '_blank');
  });
});
