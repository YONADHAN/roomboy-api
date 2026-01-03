import { Router } from 'express'
import { BusinessContactController } from '@/controllers/business_contact.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'

const router = Router()
const controller = new BusinessContactController()

router.use(authMiddleware)

router.post('/', controller.create)
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.put('/:id', controller.update)
router.patch('/:id/toggle', controller.toggleStatus)
router.delete('/:id', controller.delete)

export default router
