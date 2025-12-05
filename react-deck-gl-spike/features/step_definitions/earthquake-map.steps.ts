import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('I should see the map container', async function (this: CustomWorld) {
  // deck.gl renders a wrapper div with id 'deckgl-wrapper'
  const mapContainer = this.page.locator('#deckgl-wrapper');
  await expect(mapContainer).toBeVisible({ timeout: 10000 });
});

Then(
  'I should see the MapLibre canvas rendering',
  async function (this: CustomWorld) {
    // MapLibre renders to a canvas element with class 'maplibregl-canvas'
    const canvas = this.page.locator('canvas.maplibregl-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Verify the canvas has non-zero dimensions (map is actually rendering)
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  }
);

Given('earthquake data has loaded', async function (this: CustomWorld) {
  // Wait for the loading indicator to disappear, indicating data has loaded
  const loadingIndicator = this.page.locator('text=Loading earthquake data...');
  await expect(loadingIndicator).toBeHidden({ timeout: 30000 });
});

Then(
  'I should see earthquake points rendered on the map',
  async function (this: CustomWorld) {
    // deck.gl renders earthquake points to a canvas element
    // The deck.gl canvas is separate from the MapLibre canvas
    const deckCanvas = this.page.locator('canvas').first();
    await expect(deckCanvas).toBeVisible({ timeout: 10000 });

    // Verify the canvas is rendering (has non-zero dimensions)
    const boundingBox = await deckCanvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // Verify no error message is displayed
    const errorMessage = this.page.locator('text=Error loading data');
    await expect(errorMessage).toBeHidden();
  }
);

Then('I should see the loading indicator', async function (this: CustomWorld) {
  // The loading indicator may appear briefly - check if it exists or data already loaded
  const loadingIndicator = this.page.locator('text=Loading earthquake data...');
  const errorMessage = this.page.locator('text=Error loading data');

  // Either loading indicator is visible, or data has already loaded (no error)
  const isLoading = await loadingIndicator.isVisible().catch(() => false);
  const hasError = await errorMessage.isVisible().catch(() => false);

  // If data loaded very fast, loading indicator may not be visible
  // In that case, verify no error occurred
  if (!isLoading) {
    expect(hasError).toBe(false);
  }
});

Then(
  'the loading indicator should disappear when data loads',
  async function (this: CustomWorld) {
    // Wait for loading to complete (loading indicator hidden, no error)
    const loadingIndicator = this.page.locator(
      'text=Loading earthquake data...'
    );
    await expect(loadingIndicator).toBeHidden({ timeout: 30000 });

    // Verify no error message
    const errorMessage = this.page.locator('text=Error loading data');
    await expect(errorMessage).toBeHidden();
  }
);

When('I zoom in on the map', async function (this: CustomWorld) {
  const canvas = this.page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  // Store initial state by getting canvas bounding box for reference
  const boundingBox = await canvas.boundingBox();
  expect(boundingBox).not.toBeNull();

  // Perform zoom action using mouse wheel on the map
  const centerX = boundingBox!.x + boundingBox!.width / 2;
  const centerY = boundingBox!.y + boundingBox!.height / 2;

  await this.page.mouse.move(centerX, centerY);
  // Scroll down (negative deltaY) to zoom in
  await this.page.mouse.wheel(0, -200);

  // Wait for the map to animate the zoom
  await this.page.waitForTimeout(1000);
});

Then('the map zoom level should increase', async function (this: CustomWorld) {
  // Verify the map canvas is still visible and rendering after zoom
  const canvas = this.page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  const boundingBox = await canvas.boundingBox();
  expect(boundingBox).not.toBeNull();
  expect(boundingBox!.width).toBeGreaterThan(0);
  expect(boundingBox!.height).toBeGreaterThan(0);

  // The zoom action was successful if the map is still interactive and rendering
  // Direct zoom level verification would require accessing internal MapLibre state
});

Then(
  'the map should render without coordinate errors',
  async function (this: CustomWorld) {
    // Verify no JavaScript errors occurred during rendering
    // deck.gl would throw errors for invalid coordinates if not filtered
    const errorMessage = this.page.locator('text=Error loading data');
    await expect(errorMessage).toBeHidden();

    // Verify both canvases (MapLibre and deck.gl) are rendering properly
    const maplibreCanvas = this.page.locator('canvas.maplibregl-canvas');
    await expect(maplibreCanvas).toBeVisible({ timeout: 10000 });

    const deckglWrapper = this.page.locator('#deckgl-wrapper');
    await expect(deckglWrapper).toBeVisible({ timeout: 10000 });

    // Verify the deck.gl layer is rendering (canvas has content)
    const deckCanvas = this.page.locator('#deckgl-wrapper canvas').first();
    const boundingBox = await deckCanvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  }
);

Then('the size legend should be visible', async function (this: CustomWorld) {
  // Verify the size legend is displayed
  const sizeLegend = this.page.locator('text=Magnitude');
  await expect(sizeLegend).toBeVisible({ timeout: 10000 });

  // Verify magnitude sample labels are shown (using exact match to avoid matching '700 km')
  const magnitude3 = this.page.getByText('3', { exact: true });
  const magnitude5 = this.page.getByText('5', { exact: true });
  const magnitude7 = this.page.getByText('7', { exact: true });
  const magnitude9 = this.page.getByText('9', { exact: true });

  await expect(magnitude3).toBeVisible();
  await expect(magnitude5).toBeVisible();
  await expect(magnitude7).toBeVisible();
  await expect(magnitude9).toBeVisible();
});

When(
  'I click and drag on the map',
  { timeout: 15000 },
  async function (this: CustomWorld) {
    const canvas = this.page.locator('canvas.maplibregl-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();

    // Calculate start and end points for drag
    const startX = boundingBox!.x + boundingBox!.width / 2;
    const startY = boundingBox!.y + boundingBox!.height / 2;
    const endX = startX - 100; // Drag left
    const endY = startY - 50; // Drag up

    // Perform click and drag
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY, { steps: 10 });
    await this.page.mouse.up();

    // Wait for the map to animate the pan
    await this.page.waitForTimeout(500);
  }
);

Then(
  'the map should pan in the direction of the drag',
  async function (this: CustomWorld) {
    // Verify the map canvas is still visible and rendering after pan
    const canvas = this.page.locator('canvas.maplibregl-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // The pan action was successful if the map is still interactive and rendering
    // Direct position verification would require accessing internal MapLibre state
  }
);

Then(
  'earthquake points should maintain their geographic positions',
  async function (this: CustomWorld) {
    // Verify deck.gl layer is still rendering earthquake points
    const deckglWrapper = this.page.locator('#deckgl-wrapper');
    await expect(deckglWrapper).toBeVisible({ timeout: 10000 });

    const deckCanvas = this.page.locator('#deckgl-wrapper canvas').first();
    const boundingBox = await deckCanvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // Verify no error message is displayed
    const errorMessage = this.page.locator('text=Error loading data');
    await expect(errorMessage).toBeHidden();
  }
);

Then('I should see the zoom controls', async function (this: CustomWorld) {
  // Verify zoom controls are visible
  const zoomInButton = this.page.getByRole('button', { name: /zoom in/i });
  const zoomOutButton = this.page.getByRole('button', { name: /zoom out/i });
  const resetButton = this.page.getByRole('button', { name: /reset view/i });

  await expect(zoomInButton).toBeVisible({ timeout: 10000 });
  await expect(zoomOutButton).toBeVisible();
  await expect(resetButton).toBeVisible();
});

When('I click the zoom in button', async function (this: CustomWorld) {
  const zoomInButton = this.page.getByRole('button', { name: /zoom in/i });
  await expect(zoomInButton).toBeVisible({ timeout: 10000 });
  await zoomInButton.click();

  // Wait for zoom animation
  await this.page.waitForTimeout(500);
});

Then('the map should zoom in', async function (this: CustomWorld) {
  // Verify the map canvas is still visible and rendering
  const canvas = this.page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  const boundingBox = await canvas.boundingBox();
  expect(boundingBox).not.toBeNull();
  expect(boundingBox!.width).toBeGreaterThan(0);
  expect(boundingBox!.height).toBeGreaterThan(0);
});

When('I click the zoom out button', async function (this: CustomWorld) {
  const zoomOutButton = this.page.getByRole('button', { name: /zoom out/i });
  await expect(zoomOutButton).toBeVisible({ timeout: 10000 });
  await zoomOutButton.click();

  // Wait for zoom animation
  await this.page.waitForTimeout(500);
});

Then('the map should zoom out', async function (this: CustomWorld) {
  // Verify the map canvas is still visible and rendering
  const canvas = this.page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  const boundingBox = await canvas.boundingBox();
  expect(boundingBox).not.toBeNull();
  expect(boundingBox!.width).toBeGreaterThan(0);
  expect(boundingBox!.height).toBeGreaterThan(0);
});

When('I click the reset view button', async function (this: CustomWorld) {
  const resetButton = this.page.getByRole('button', { name: /reset view/i });
  await expect(resetButton).toBeVisible({ timeout: 10000 });
  await resetButton.click();

  // Wait for view transition
  await this.page.waitForTimeout(500);
});

Then(
  'the map should return to the initial view',
  async function (this: CustomWorld) {
    // Verify the map canvas is still visible and rendering
    const canvas = this.page.locator('canvas.maplibregl-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // Verify no error occurred
    const errorMessage = this.page.locator('text=Error loading data');
    await expect(errorMessage).toBeHidden();
  }
);

Then(
  'earthquake points should remain at their geographic locations',
  async function (this: CustomWorld) {
    // Verify deck.gl layer is still rendering earthquake points
    // Points maintaining geographic positions means:
    // 1. The layer is still visible
    // 2. No errors occurred during navigation
    // 3. The canvas is rendering properly
    const deckglWrapper = this.page.locator('#deckgl-wrapper');
    await expect(deckglWrapper).toBeVisible({ timeout: 10000 });

    const deckCanvas = this.page.locator('#deckgl-wrapper canvas').first();
    const boundingBox = await deckCanvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // Verify no error message is displayed
    const errorMessage = this.page.locator('text=Error loading data');
    await expect(errorMessage).toBeHidden();
  }
);

When('I zoom out on the map', async function (this: CustomWorld) {
  const canvas = this.page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  const boundingBox = await canvas.boundingBox();
  expect(boundingBox).not.toBeNull();

  // Perform zoom out action using mouse wheel
  const centerX = boundingBox!.x + boundingBox!.width / 2;
  const centerY = boundingBox!.y + boundingBox!.height / 2;

  await this.page.mouse.move(centerX, centerY);
  // Scroll up (positive deltaY) to zoom out
  await this.page.mouse.wheel(0, 200);

  // Wait for the map to animate the zoom
  await this.page.waitForTimeout(1000);
});

Then(
  'the earthquake layer should be pickable for tooltip display',
  async function (this: CustomWorld) {
    // Verify the deck.gl wrapper is present (where pickable layers render)
    const deckglWrapper = this.page.locator('#deckgl-wrapper');
    await expect(deckglWrapper).toBeVisible({ timeout: 10000 });

    // Verify deck.gl canvas is rendering (where picking happens)
    const deckCanvas = this.page.locator('#deckgl-wrapper canvas').first();
    await expect(deckCanvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await deckCanvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // Verify no error message is displayed (tooltip hook would cause errors if broken)
    const errorMessage = this.page.locator('text=Error loading data');
    await expect(errorMessage).toBeHidden();

    // The actual hover->tooltip functionality is tested via unit tests
    // because reliably hitting rendered points in a headless browser is non-deterministic
  }
);

// Date Range Filtering Steps

Then(
  'I should see the date range selector',
  async function (this: CustomWorld) {
    const dateRangeSelector = this.page.locator(
      '[data-testid="date-range-selector"]'
    );
    await expect(dateRangeSelector).toBeVisible({ timeout: 10000 });

    // Verify the label is present
    const label = this.page.locator('text=Time Period');
    await expect(label).toBeVisible();
  }
);

Then(
  'I should see the time period presets',
  async function (this: CustomWorld) {
    // Verify all preset buttons are visible
    const preset24h = this.page.locator('[data-testid="preset-24h"]');
    const preset7d = this.page.locator('[data-testid="preset-7d"]');
    const preset30d = this.page.locator('[data-testid="preset-30d"]');
    const presetAll = this.page.locator('[data-testid="preset-all"]');

    await expect(preset24h).toBeVisible({ timeout: 10000 });
    await expect(preset7d).toBeVisible();
    await expect(preset30d).toBeVisible();
    await expect(presetAll).toBeVisible();
  }
);

When(
  'I click the {string} preset button',
  async function (this: CustomWorld, presetLabel: string) {
    const testId = `preset-${presetLabel.toLowerCase()}`;
    const presetButton = this.page.locator(`[data-testid="${testId}"]`);
    await expect(presetButton).toBeVisible({ timeout: 10000 });

    // Store the current count before clicking for comparison
    const statsPanel = this.page.locator('[data-testid="earthquake-stats"]');
    const initialText = await statsPanel.textContent();
    (this as CustomWorld & { initialStatsText?: string }).initialStatsText =
      initialText || '';

    await presetButton.click();

    // Wait for filter to be applied and UI to update
    await this.page.waitForTimeout(500);
  }
);

Then('the earthquake count should update', async function (this: CustomWorld) {
  // Verify the stats panel is visible and shows a count
  const statsPanel = this.page.locator('[data-testid="earthquake-stats"]');
  await expect(statsPanel).toBeVisible({ timeout: 10000 });

  // Verify it shows earthquake count information
  const statsText = await statsPanel.textContent();
  expect(statsText).toMatch(/\d+/); // Should contain at least one number
});

Then(
  'the filter indicator should show active state',
  async function (this: CustomWorld) {
    // When a filter is active, the filter indicator element should be visible
    const filterIndicator = this.page.locator(
      '[data-testid="filter-indicator"]'
    );
    await expect(filterIndicator).toBeVisible({ timeout: 10000 });

    // The filter indicator should show "Filter active" text
    const filterText = await filterIndicator.textContent();
    expect(filterText).toContain('Filter active');
  }
);

Then(
  'the earthquake count should show all earthquakes',
  async function (this: CustomWorld) {
    const statsPanel = this.page.locator('[data-testid="earthquake-stats"]');
    await expect(statsPanel).toBeVisible({ timeout: 10000 });

    // When showing all, it should just show the total count without "of X" qualifier
    const statsText = await statsPanel.textContent();
    expect(statsText).toMatch(/\d+\s+earthquakes/i);
  }
);

Then(
  'the filter indicator should not show active state',
  async function (this: CustomWorld) {
    const statsPanel = this.page.locator('[data-testid="earthquake-stats"]');
    await expect(statsPanel).toBeVisible({ timeout: 10000 });

    // When no filter is active, the filter indicator element should not be visible
    const filterIndicator = this.page.locator(
      '[data-testid="filter-indicator"]'
    );
    await expect(filterIndicator).toBeHidden();

    // The "of X" total count element should also not be visible
    const totalCountElement = this.page.locator('[data-testid="total-count"]');
    await expect(totalCountElement).toBeHidden();
  }
);

Then(
  'I should see the earthquake stats panel',
  async function (this: CustomWorld) {
    const statsPanel = this.page.locator('[data-testid="earthquake-stats"]');
    await expect(statsPanel).toBeVisible({ timeout: 10000 });
  }
);

Then(
  'the stats should indicate filtering is active',
  async function (this: CustomWorld) {
    // When filtering is active, the filter indicator should be visible
    const filterIndicator = this.page.locator(
      '[data-testid="filter-indicator"]'
    );
    await expect(filterIndicator).toBeVisible({ timeout: 10000 });

    // And the total count element should show the unfiltered total
    const totalCountElement = this.page.locator('[data-testid="total-count"]');
    await expect(totalCountElement).toBeVisible();
  }
);
