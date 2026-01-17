// Invoice Management Routes
import { Router } from 'express';
import { InvoiceController } from './invoices.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const invoiceController = new InvoiceController();

router.use(authenticate);

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/:id', invoiceController.updateInvoice);
router.post('/:id/send-whatsapp', invoiceController.sendViaWhatsApp);
router.get('/overdue/list', invoiceController.getOverdueInvoices);

export default router;



