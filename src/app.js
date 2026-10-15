/**
 * Express app configuration.
 * Responsibilities:
 *  - Base routes (/, /health)
 *  - Auto-mount all routers in src/routes/auto/*.route.js
 *  - Global error handler (consistent JSON for errors)
 */
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { errorHandler } from './utils/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Simple root + health endpoints
app.get('/', (_req, res) => res.json({ ok: true, message: 'Hello from CI/CD demo 👋' }))
app.get('/health', (_req, res) => res.status(200).send('OK'))

// Auto-mount all routers placed under src/routes/auto
const autoDir = path.join(__dirname, 'routes', 'auto')
if (fs.existsSync(autoDir)) {
  // sort() : ordre de montage identique sur tous les OS
  const files = fs.readdirSync(autoDir).filter(f => f.endsWith('.route.js')).sort()
  for (const f of files) {
    // import() dynamique (ESM natif) au lieu de require() :
    // le fichier passe par Vitest, donc sa couverture est mesurée
    const mod = await import(pathToFileURL(path.join(autoDir, f)).href)
    const router = mod.default
    if (router) app.use('/', router)
  }
}

// Global error middleware last
app.use(errorHandler)

export default app
