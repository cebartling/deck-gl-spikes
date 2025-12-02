import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('I should see the map container', async function (this: CustomWorld) {
  const mapContainer = this.page.locator('.deckgl');
  await expect(mapContainer).toBeVisible({ timeout: 10000 });
});

Then('I should see the MapLibre canvas rendering', async function (this: CustomWorld) {
  // MapLibre renders to a canvas element with class 'maplibregl-canvas'
  const canvas = this.page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });

  // Verify the canvas has non-zero dimensions (map is actually rendering)
  const boundingBox = await canvas.boundingBox();
  expect(boundingBox).not.toBeNull();
  expect(boundingBox!.width).toBeGreaterThan(0);
  expect(boundingBox!.height).toBeGreaterThan(0);
});
