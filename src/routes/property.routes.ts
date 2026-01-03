import { Router } from 'express'
import { PropertyController } from '@/controllers/property.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'

const router = Router()
const controller = new PropertyController()

// All routes require authentication
router.use(authMiddleware)

router.post('/', controller.create)
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.put('/:id', controller.update)
router.patch('/:id/status', controller.updateStatus)
router.delete('/:id', controller.delete)

export default router
