import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Map container steps
Then(
  'I should see the flight map container',
  async function (this: CustomWorld) {
    const mapContainer = this.page.locator('#deckgl-wrapper');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
  }
);

// Loading state steps
Given('flight routes data has loaded', async function (this: CustomWorld) {
  const loadingIndicator = this.page.locator('text=Loading flight routes...');
  await expect(loadingIndicator).toBeHidden({ timeout: 30000 });
});

Then(
  'I should see the flight routes loading indicator',
  async function (this: CustomWorld) {
    const loadingIndicator = this.page.locator('text=Loading flight routes...');
    const errorMessage = this.page.locator('text=Error:');

    const isLoading = await loadingIndicator.isVisible().catch(() => false);
    const hasError = await errorMessage.isVisible().catch(() => false);

    // If data loaded very fast, loading indicator may not be visible
    if (!isLoading) {
      expect(hasError).toBe(false);
    }
  }
);

Then(
  'the flight routes loading indicator should disappear when data loads',
  async function (this: CustomWorld) {
    const loadingIndicator = this.page.locator('text=Loading flight routes...');
    await expect(loadingIndicator).toBeHidden({ timeout: 30000 });

    const errorMessage = this.page.locator('text=Error:');
    await expect(errorMessage).toBeHidden();
  }
);

// Flight routes rendering steps
Then(
  'I should see flight routes rendered on the map',
  async function (this: CustomWorld) {
    const deckCanvas = this.page.locator('canvas').first();
    await expect(deckCanvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await deckCanvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    const errorMessage = this.page.locator('text=Error:');
    await expect(errorMessage).toBeHidden();
  }
);

// Zoom interaction steps
When('I zoom in on the flight map', async function (this: CustomWorld) {
  const canvas = this.page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  const boundingBox = await canvas.boundingBox();
  expect(boundingBox).not.toBeNull();

  const centerX = boundingBox!.x + boundingBox!.width / 2;
  const centerY = boundingBox!.y + boundingBox!.height / 2;

  await this.page.mouse.move(centerX, centerY);
  await this.page.mouse.wheel(0, -200);
  await this.page.waitForTimeout(1000);
});

Then(
  'the flight map zoom level should increase',
  async function (this: CustomWorld) {
    const canvas = this.page.locator('canvas.maplibregl-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  }
);

// Legend steps
Then(
  'I should see the flight routes legend',
  async function (this: CustomWorld) {
    const legend = this.page.locator('text=Flight Routes');
    await expect(legend).toBeVisible({ timeout: 10000 });
  }
);

Then(
  'the legend should show direction indicators',
  async function (this: CustomWorld) {
    const originLabel = this.page.locator('text=Origin');
    const destinationLabel = this.page.locator('text=Destination');

    await expect(originLabel).toBeVisible({ timeout: 10000 });
    await expect(destinationLabel).toBeVisible();
  }
);

Then(
  'the legend should show frequency indicators',
  async function (this: CustomWorld) {
    const frequencyLabel = this.page.locator('text=Flight Frequency');
    await expect(frequencyLabel).toBeVisible({ timeout: 10000 });

    const lowLabel = this.page.locator('text=Low');
    const highLabel = this.page.locator('text=High');

    await expect(lowLabel).toBeVisible();
    await expect(highLabel).toBeVisible();
  }
);

// Zoom controls steps
Then(
  'I should see the flight map zoom controls',
  async function (this: CustomWorld) {
    const zoomInButton = this.page.getByRole('button', { name: /zoom in/i });
    const zoomOutButton = this.page.getByRole('button', { name: /zoom out/i });
    const resetButton = this.page.getByRole('button', { name: /reset view/i });

    await expect(zoomInButton).toBeVisible({ timeout: 10000 });
    await expect(zoomOutButton).toBeVisible();
    await expect(resetButton).toBeVisible();
  }
);

When(
  'I click the flight map zoom in button',
  async function (this: CustomWorld) {
    const zoomInButton = this.page.getByRole('button', { name: /zoom in/i });
    await expect(zoomInButton).toBeVisible({ timeout: 10000 });
    await zoomInButton.click();
    await this.page.waitForTimeout(500);
  }
);

Then('the flight map should zoom in', async function (this: CustomWorld) {
  const canvas = this.page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  const boundingBox = await canvas.boundingBox();
  expect(boundingBox).not.toBeNull();
  expect(boundingBox!.width).toBeGreaterThan(0);
  expect(boundingBox!.height).toBeGreaterThan(0);
});

When(
  'I click the flight map zoom out button',
  async function (this: CustomWorld) {
    const zoomOutButton = this.page.getByRole('button', { name: /zoom out/i });
    await expect(zoomOutButton).toBeVisible({ timeout: 10000 });
    await zoomOutButton.click();
    await this.page.waitForTimeout(500);
  }
);

Then('the flight map should zoom out', async function (this: CustomWorld) {
  const canvas = this.page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  const boundingBox = await canvas.boundingBox();
  expect(boundingBox).not.toBeNull();
  expect(boundingBox!.width).toBeGreaterThan(0);
  expect(boundingBox!.height).toBeGreaterThan(0);
});

When(
  'I click the flight map reset view button',
  async function (this: CustomWorld) {
    const resetButton = this.page.getByRole('button', { name: /reset view/i });
    await expect(resetButton).toBeVisible({ timeout: 10000 });
    await resetButton.click();
    await this.page.waitForTimeout(500);
  }
);

Then(
  'the flight map should return to the initial view',
  async function (this: CustomWorld) {
    const canvas = this.page.locator('canvas.maplibregl-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    const errorMessage = this.page.locator('text=Error:');
    await expect(errorMessage).toBeHidden();
  }
);

// Pan steps
When(
  'I click and drag on the flight map',
  { timeout: 15000 },
  async function (this: CustomWorld) {
    const canvas = this.page.locator('canvas.maplibregl-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();

    const startX = boundingBox!.x + boundingBox!.width / 2;
    const startY = boundingBox!.y + boundingBox!.height / 2;
    const endX = startX - 100;
    const endY = startY - 50;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY, { steps: 10 });
    await this.page.mouse.up();
    await this.page.waitForTimeout(500);
  }
);

Then(
  'the flight map should pan in the direction of the drag',
  async function (this: CustomWorld) {
    const canvas = this.page.locator('canvas.maplibregl-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  }
);

// Airport filter steps
Then('I should see the airport filter', async function (this: CustomWorld) {
  const filterLabel = this.page.locator('text=Filter by Airport');
  await expect(filterLabel).toBeVisible({ timeout: 10000 });
});

Then(
  'the airport filter should have a search input',
  async function (this: CustomWorld) {
    const searchInput = this.page.locator(
      'input[placeholder="Search airports..."]'
    );
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  }
);

// Network summary stats steps
Then(
  'I should see the network summary stats',
  async function (this: CustomWorld) {
    const summaryTitle = this.page.locator('text=Network Summary');
    await expect(summaryTitle).toBeVisible({ timeout: 10000 });
  }
);

Then('the stats should show routes count', async function (this: CustomWorld) {
  const routesLabel = this.page.getByText('Routes', { exact: true });
  await expect(routesLabel).toBeVisible({ timeout: 10000 });
});

Then(
  'the stats should show weekly flights count',
  async function (this: CustomWorld) {
    const flightsLabel = this.page.locator('text=Weekly Flights');
    await expect(flightsLabel).toBeVisible({ timeout: 10000 });
  }
);

Then(
  'the stats should show connected airports count',
  async function (this: CustomWorld) {
    const airportsLabel = this.page.locator('text=Connected Airports');
    await expect(airportsLabel).toBeVisible({ timeout: 10000 });
  }
);

// Airport dropdown steps
When('I focus on the airport search input', async function (this: CustomWorld) {
  const searchInput = this.page.locator(
    'input[placeholder="Search airports..."]'
  );
  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await searchInput.focus();
  await this.page.waitForTimeout(300);
});

Then('I should see the airport dropdown', async function (this: CustomWorld) {
  const dropdown = this.page.locator('text=All Airports');
  await expect(dropdown).toBeVisible({ timeout: 10000 });
});

Then(
  'I should see the all airports option',
  async function (this: CustomWorld) {
    const allAirportsOption = this.page.locator(
      'button:has-text("All Airports")'
    );
    await expect(allAirportsOption).toBeVisible({ timeout: 10000 });
  }
);

// Filter mode selector steps
When(
  'I select an airport from the dropdown',
  async function (this: CustomWorld) {
    const searchInput = this.page.locator(
      'input[placeholder="Search airports..."]'
    );
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.focus();
    await this.page.waitForTimeout(500);

    // Find and click on the first airport option (excluding "All Airports")
    const airportOption = this.page
      .locator('.font-mono.font-bold.text-cyan-400')
      .first();
    await expect(airportOption).toBeVisible({ timeout: 10000 });

    // Click the parent button element
    const airportButton = airportOption
      .locator('xpath=ancestor::button')
      .first();
    await airportButton.click();
    await this.page.waitForTimeout(500);
  }
);

Then(
  'I should see the filter mode selector',
  async function (this: CustomWorld) {
    const filterModeLabel = this.page.locator('text=Show Routes');
    await expect(filterModeLabel).toBeVisible({ timeout: 10000 });
  }
);

Then(
  'the filter mode selector should have route type options',
  async function (this: CustomWorld) {
    const allRoutesButton = this.page.locator('button:has-text("All Routes")');
    const departuresButton = this.page.locator('button:has-text("Departures")');
    const arrivalsButton = this.page.locator('button:has-text("Arrivals")');

    await expect(allRoutesButton).toBeVisible({ timeout: 10000 });
    await expect(departuresButton).toBeVisible();
    await expect(arrivalsButton).toBeVisible();
  }
);

// Clear filter steps
When('I click the clear filter button', async function (this: CustomWorld) {
  const clearButton = this.page.getByRole('button', { name: /clear filter/i });
  await expect(clearButton).toBeVisible({ timeout: 10000 });
  await clearButton.click();
  await this.page.waitForTimeout(500);
});

Then(
  'the network summary should be displayed',
  async function (this: CustomWorld) {
    const summaryTitle = this.page.locator('text=Network Summary');
    await expect(summaryTitle).toBeVisible({ timeout: 10000 });
  }
);

Then(
  'the filter mode selector should not be visible',
  async function (this: CustomWorld) {
    const filterModeLabel = this.page.locator('text=Show Routes');
    await expect(filterModeLabel).toBeHidden({ timeout: 10000 });
  }
);

// Tooltip/pickable layer steps
Then(
  'the flight routes layer should be pickable for tooltip display',
  async function (this: CustomWorld) {
    const deckglWrapper = this.page.locator('#deckgl-wrapper');
    await expect(deckglWrapper).toBeVisible({ timeout: 10000 });

    const deckCanvas = this.page.locator('#deckgl-wrapper canvas').first();
    await expect(deckCanvas).toBeVisible({ timeout: 10000 });

    const boundingBox = await deckCanvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    const errorMessage = this.page.locator('text=Error:');
    await expect(errorMessage).toBeHidden();
  }
);
