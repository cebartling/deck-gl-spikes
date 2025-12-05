import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the home page', async function (this: CustomWorld) {
  await this.page.goto(this.baseUrl);
});

Given('I am on the about page', async function (this: CustomWorld) {
  await this.page.goto(`${this.baseUrl}/about`);
});

Given('I am on the earthquakes page', async function (this: CustomWorld) {
  await this.page.goto(`${this.baseUrl}/earthquakes`);
});

When(
  'I click the {string} link',
  async function (this: CustomWorld, linkText: string) {
    await this.page.click(`text=${linkText}`);
  }
);

Then(
  'I should see the heading {string}',
  async function (this: CustomWorld, heading: string) {
    const h1 = this.page.locator('h1');
    await expect(h1).toHaveText(heading);
  }
);

Then(
  'I should see the project description',
  async function (this: CustomWorld) {
    const description = this.page.locator(
      'p:has-text("React + TypeScript spike project")'
    );
    await expect(description).toBeVisible();
  }
);

Then('I should be on the About page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(`${this.baseUrl}/about`);
  const h1 = this.page.locator('h1');
  await expect(h1).toHaveText('About');
});

Then('I should be on the Home page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(`${this.baseUrl}/`);
  const h1 = this.page.locator('h1');
  await expect(h1).toHaveText('deck.gl Spike Project');
});

Then('I should be on the earthquakes page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(`${this.baseUrl}/earthquakes`);
  const mapContainer = this.page.locator('canvas');
  await expect(mapContainer).toBeVisible({ timeout: 10000 });
});

// Header navigation steps
Then('I should see the header', async function (this: CustomWorld) {
  const header = this.page.locator('header');
  await expect(header).toBeVisible();
});

Then(
  'the header should contain the site title',
  async function (this: CustomWorld) {
    const siteTitle = this.page.locator('header >> text=deck.gl Spike');
    await expect(siteTitle).toBeVisible();
  }
);

Then(
  'the header should have navigation elements',
  async function (this: CustomWorld) {
    const homeLink = this.page.locator('header >> a:has-text("Home")');
    const spikesButton = this.page.locator(
      'header >> button:has-text("Spikes")'
    );
    const aboutLink = this.page.locator('header >> a:has-text("About")');

    await expect(homeLink).toBeVisible();
    await expect(spikesButton).toBeVisible();
    await expect(aboutLink).toBeVisible();
  }
);

When(
  'I click the header {string} link',
  async function (this: CustomWorld, linkText: string) {
    const link = this.page.locator(`header >> a:has-text("${linkText}")`);
    await link.click();
  }
);

// Dropdown steps
When(
  'I click the {string} dropdown button',
  async function (this: CustomWorld, buttonText: string) {
    const button = this.page.locator(
      `header >> button:has-text("${buttonText}")`
    );
    await button.click();
  }
);

When(
  'I click the {string} dropdown item',
  async function (this: CustomWorld, itemText: string) {
    const item = this.page.locator(
      `[role="menu"] >> a:has-text("${itemText}")`
    );
    await item.click();
  }
);

Then(
  'I should see the {string} dropdown item',
  async function (this: CustomWorld, itemText: string) {
    const item = this.page.locator(
      `[role="menu"] >> a:has-text("${itemText}")`
    );
    await expect(item).toBeVisible();
  }
);

Then('the dropdown menu should be visible', async function (this: CustomWorld) {
  const menu = this.page.locator('[role="menu"]');
  await expect(menu).toBeVisible();
});

Then('the dropdown menu should be hidden', async function (this: CustomWorld) {
  const menu = this.page.locator('[role="menu"]');
  await expect(menu).toBeHidden();
});

When('I click outside the dropdown', async function (this: CustomWorld) {
  // Click on the header area outside the dropdown
  const header = this.page.locator('header');
  await header.click({ position: { x: 10, y: 10 } });
});

// Footer steps
Then('I should see the footer', async function (this: CustomWorld) {
  const footer = this.page.locator('footer');
  await expect(footer).toBeVisible();
});

Then(
  'the footer should contain the copyright text',
  async function (this: CustomWorld) {
    const copyright = this.page.locator(
      'footer >> text=Pintail Consulting LLC'
    );
    await expect(copyright).toBeVisible();
  }
);
