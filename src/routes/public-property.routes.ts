import { Router } from 'express'
import { PublicPropertyController } from '@/controllers/public-property.controller.js'

const router = Router()
const controller = new PublicPropertyController()

// Public routes - NO authentication required
router.get('/properties', controller.list)
router.get('/properties/:id', controller.getById)
router.get('/properties/slug/:slug', controller.getBySlug)
router.get('/field-definitions', controller.getFieldDefinitions)

export default router
