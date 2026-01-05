
import { Router } from 'express'
import { PublicLocationController } from '@/controllers/public-location.controller.js'

const router = Router()
const controller = new PublicLocationController()

// GET /api/v1/public/locations
router.get('/', controller.list)

export default router
