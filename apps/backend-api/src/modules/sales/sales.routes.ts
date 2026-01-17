// Sales Management Routes
import { Router } from 'express';
import { SaleController } from './sales.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const saleController = new SaleController();

router.use(authenticate);

router.post('/', saleController.createSale);
router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSaleById);
router.get('/reports/monthly', saleController.getMonthlySalesReport);

export default router;



