# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + TypeScript spike project for deck.gl visualization, featuring an earthquake map that displays real-time USGS earthquake data.

## Commands

```bash
npm run dev              # Start dev server with HMR
npm run build            # Type-check + production build
npm run test             # Run Vitest in watch mode
npm run test:run         # Run Vitest once
npm run test:acceptance  # Run Cucumber acceptance tests (requires Playwright)
npm run lint             # ESLint
npm run format           # Prettier format
```

Before running acceptance tests: `npx playwright install chromium`

## Tech Stack

- **Framework**: React 19, TypeScript 5.9, Vite (rolldown-vite)
- **Mapping**: deck.gl 9.2, MapLibre GL, react-map-gl
- **State**: Zustand 5 for global state management
- **Validation**: Zod 4 for runtime type validation
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + Testing Library (unit), Cucumber + Playwright (acceptance)

## Project Structure

```
src/
├── components/
│   └── EarthquakeMap/
│       ├── EarthquakeMap.tsx      # Main map component with deck.gl
│       ├── MapContainer.tsx       # Responsive container wrapper
│       └── layers/
│           └── earthquakeLayer.ts # ScatterplotLayer factory
├── stores/
│   ├── index.ts                   # Barrel exports
│   ├── earthquakeStore.ts         # Earthquake data state
│   └── mapViewStore.ts            # Map view state (zoom, center, etc.)
├── hooks/
│   └── useEarthquakeData.ts       # Fetches USGS data with Zod validation
├── types/
│   └── earthquake.ts              # Zod schemas + inferred types
├── pages/                         # Route components (Home, About)
└── test/                          # Test utilities and setup

features/                          # Cucumber acceptance tests
├── *.feature                      # Gherkin scenarios
├── step_definitions/              # Step implementations
└── support/                       # Playwright world, hooks, server
```

## Key Patterns

### Zod Validation

API responses are validated at runtime using Zod schemas. Types are inferred from schemas:

```typescript
// src/types/earthquake.ts
export const EarthquakeSchema = z.object({...});
export type Earthquake = z.infer<typeof EarthquakeSchema>;
```

### deck.gl Layers

Layers are created via factory functions in `src/components/EarthquakeMap/layers/`:

```typescript
export function createEarthquakeLayer(data: Earthquake[]) {
  return new ScatterplotLayer<Earthquake>({...});
}
```

### Zustand Stores

Global state is managed with Zustand stores in `src/stores/`:

```typescript
// Access state with selectors (avoids unnecessary re-renders)
const earthquakes = useEarthquakeStore((state) => state.earthquakes);
const fetchEarthquakes = useEarthquakeStore((state) => state.fetchEarthquakes);

// Map view state
const viewState = useMapViewStore((state) => state.viewState);
const setViewState = useMapViewStore((state) => state.setViewState);
```

Stores include `reset()` methods for testing. Call in `beforeEach`:

```typescript
beforeEach(() => {
  useEarthquakeStore.getState().reset();
  useMapViewStore.getState().reset();
});
```

## Testing Conventions

- **Unit tests**: Co-located with source files (`*.test.ts(x)`)
- **Acceptance tests**: Gherkin features in `features/`, steps in `features/step_definitions/`
- **Mocking**: deck.gl and MapLibre components are mocked in unit tests

## Pre-Commit Checklist

Before committing changes or opening a pull request, always run:

```bash
npm run lint          # Check for ESLint errors
npm run format        # Format code with Prettier
npm run test:run      # Run all unit tests
npm run build         # Verify TypeScript compilation
```

Or run all checks in sequence:

```bash
npm run lint && npm run format && npm run test:run && npm run build
```

**Important**: Fix any lint errors before committing. The CI pipeline will fail if linting or formatting checks do not pass.
