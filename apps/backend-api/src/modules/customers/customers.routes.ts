// Customer Management Routes
import { Router } from 'express';
import { CustomerController } from './customers.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const customerController = new CustomerController();

router.use(authenticate);

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.get('/:id/rentals', customerController.getCustomerRentals);
router.get('/:id/payments', customerController.getCustomerPayments);

export default router;



