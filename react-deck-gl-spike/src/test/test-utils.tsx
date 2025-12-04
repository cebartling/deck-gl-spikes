import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

function customRender(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { route = '/', ...renderOptions } = options;

  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>;
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
}

export * from '@testing-library/react';
export { customRender as render };
