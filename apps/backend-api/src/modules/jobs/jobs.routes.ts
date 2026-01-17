// Technician Job Management Routes
import { Router } from 'express';
import { JobController } from './jobs.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const jobController = new JobController();

router.use(authenticate);

router.post('/', jobController.createJob);
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', jobController.updateJob);
router.post('/:id/start', jobController.startJob);
router.post('/:id/complete', jobController.completeJob);
router.get('/technician/:technicianId/today', jobController.getTechnicianTodayJobs);

export default router;



