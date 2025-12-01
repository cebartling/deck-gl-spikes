import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { startDevServer, stopDevServer } from './server';

BeforeAll(async function () {
  await startDevServer();
});

AfterAll(async function () {
  await stopDevServer();
});

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld) {
  await this.cleanup();
});
