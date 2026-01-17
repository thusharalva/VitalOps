// Authentication routes
import { Router } from 'express';
import { AuthController } from '../modules/auth/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticate, authController.getProfile);
router.put('/me', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

export default router;



