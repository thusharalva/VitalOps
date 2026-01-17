// Dashboard & Reports Routes
import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

router.use(authenticate);

router.get('/overview', dashboardController.getOverview);
router.get('/stats', dashboardController.getStats);
router.get('/recent-activity', dashboardController.getRecentActivity);

export default router;



