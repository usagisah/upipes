/// <reference types="vitest" />
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: "./test-coverage"
    },
  }
})
