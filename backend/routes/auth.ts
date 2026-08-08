import { Router } from 'express'
import { login, getMe, employeeOnboard } from '../controllers/auth'
import { authenticate } from '../middlewares/auth.middleware'
import { avatarUpload } from '../middlewares/upload.middleware'

const router = Router()

router.post('/login', login)

// Employee onboarding via magic link — accepts multipart/form-data
router.post('/employee-onboard', avatarUpload.single('avatar'), employeeOnboard)

router.get('/me', authenticate, getMe)

export default router
