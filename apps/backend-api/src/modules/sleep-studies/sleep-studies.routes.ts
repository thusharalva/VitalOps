// Sleep Study Management Routes
import { Router } from 'express';
import { SleepStudyController } from './sleep-studies.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const sleepStudyController = new SleepStudyController();

router.use(authenticate);

router.post('/', sleepStudyController.createSleepStudy);
router.get('/', sleepStudyController.getAllSleepStudies);
router.get('/:id', sleepStudyController.getSleepStudyById);
router.put('/:id', sleepStudyController.updateSleepStudy);
router.post('/:id/upload-report', sleepStudyController.uploadReport);
router.post('/:id/send-recommendation', sleepStudyController.sendRecommendation);

export default router;



