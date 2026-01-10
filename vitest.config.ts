import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: false,
        include: ['test/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: ['node_modules/', '**/*.config.ts', '**/*.d.ts', 'dist/']
        }
    }
})
