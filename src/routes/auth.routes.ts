import { Router } from 'express'
import { AuthController } from '@/controllers/auth.controller.js'

const router = Router()
const controller = new AuthController()

router.post('/signin', controller.signin)
router.post('/refresh', controller.refresh)
router.post('/logout', controller.logout)

export default router
