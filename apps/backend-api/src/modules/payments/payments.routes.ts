// Payment Management Routes
import { Router } from 'express';
import { PaymentController } from './payments.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const paymentController = new PaymentController();

router.use(authenticate);

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.get('/reports/daily', paymentController.getDailyPaymentReport);

export default router;



