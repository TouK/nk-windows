import { defineConfig } from "cypress";

const snapshotsSettings = {
  pluginVisualRegressionMaxDiffThreshold: 0.00004,
  pluginVisualRegressionUpdateImages: false,
  pluginVisualRegressionForceDeviceScaleFactor: false,
};

export default defineConfig({
  env: {
    ...snapshotsSettings,
  },
  defaultCommandTimeout: 10000,
  e2e: {
    experimentalRunAllSpecs: true,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.ts")(on, config);
    },
    baseUrl: "http://localhost:6006",
    excludeSpecPattern: ["**/__snapshots__/*", "**/__image_snapshots__/*"],
  },
});
