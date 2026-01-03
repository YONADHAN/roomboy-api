// location.routes.ts
import { Router } from 'express'
import { LocationController } from '@/controllers/location.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'

const router = Router()
const controller = new LocationController()

router.use(authMiddleware)

router.post('/', controller.create)
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.put('/:id', controller.update)
router.patch('/:id/toggle', controller.toggleStatus)

export default router