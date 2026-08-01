import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    fileParallelism: false,  // only have one test DB, so we can't run in parallel
    setupFiles: "./test/setup.ts"
  },
});
