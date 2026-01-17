// User management routes
import { Router } from 'express';
import { UserController } from '../modules/users/users.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const userController = new UserController();

router.use(authenticate);

// Get all users (Admin/Manager only)
router.get('/', authorize(['ADMIN', 'MANAGER']), userController.getAllUsers);

// Update user (Admin only)
router.put('/:id', authorize(['ADMIN']), userController.updateUser);

// Deactivate user (Admin only)
router.delete('/:id', authorize(['ADMIN']), userController.deactivateUser);

export default router;



