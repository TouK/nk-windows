import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    'cypress-plugin-snapshots': {
      imageConfig: {
        threshold: 0.00004,
      },
      updateSnapshots: false,
    },
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts')(on, config)
    },
    baseUrl: 'http://localhost:6006',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
  },
})
