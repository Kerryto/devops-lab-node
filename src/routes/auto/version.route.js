/**
 * GET /version → { version: "<package.json version>" }
 * DEVOPS-1 : réutilise getPackageInfo() au lieu de relire package.json ici
 * (une seule source de vérité, plus de chemin relatif '../../..' fragile).
 */
import { Router } from 'express'
import { getPackageInfo } from '../../utils/appInfo.js'

const router = Router()

router.get('/version', (_req, res) => {
  const { version } = getPackageInfo()
  res.status(200).json({ version })
})

export default router
