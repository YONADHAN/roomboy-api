import { Router } from 'express'
import { FieldDefinitionController } from '@/controllers/field-definition.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'

const router = Router()
const controller = new FieldDefinitionController()

// All routes require authentication
router.use(authMiddleware)

router.post('/', controller.create)
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.put('/:id', controller.update)
router.patch('/:id/toggle', controller.toggleStatus)

export default router
