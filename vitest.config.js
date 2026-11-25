/**
 * Vitest configuration.
 * NB : Vitest ne lit PAS la clé "vitest" de package.json.
 * Les seuils de couverture doivent être déclarés ici.
 */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      // index.js ne fait que app.listen() : aucun test ne le lance
      exclude: ['src/index.js'],
      reporter: ['text', 'html', 'lcov'],
      // Quality gate : sous un seuil, la commande échoue (exit code 1)
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    }
  }
})
