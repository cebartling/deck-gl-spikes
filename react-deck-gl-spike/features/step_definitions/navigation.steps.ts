import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the home page', async function (this: CustomWorld) {
  await this.page.goto(this.baseUrl);
});

Given('I am on the about page', async function (this: CustomWorld) {
  await this.page.goto(`${this.baseUrl}/about`);
});

When('I click the {string} link', async function (this: CustomWorld, linkText: string) {
  await this.page.click(`text=${linkText}`);
});

When('I click the counter button', async function (this: CustomWorld) {
  await this.page.click('button:has-text("count is")');
});

Then('I should see the heading {string}', async function (this: CustomWorld, heading: string) {
  const h1 = this.page.locator('h1');
  await expect(h1).toHaveText(heading);
});

Then('I should see a counter button with count {string}', async function (this: CustomWorld, count: string) {
  const button = this.page.locator('button');
  await expect(button).toContainText(`count is ${count}`);
});

Then('I should see a link to the About page', async function (this: CustomWorld) {
  const link = this.page.locator('a:has-text("Go to About")');
  await expect(link).toBeVisible();
});

Then('I should see a link to the Home page', async function (this: CustomWorld) {
  const link = this.page.locator('a:has-text("Go to Home")');
  await expect(link).toBeVisible();
});

Then('I should see the project description', async function (this: CustomWorld) {
  const description = this.page.locator('p:has-text("React + TypeScript spike project")');
  await expect(description).toBeVisible();
});

Then('I should be on the About page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(`${this.baseUrl}/about`);
  const h1 = this.page.locator('h1');
  await expect(h1).toHaveText('About');
});

Then('I should be on the Home page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(`${this.baseUrl}/`);
  const h1 = this.page.locator('h1');
  await expect(h1).toHaveText('Vite + React');
});
