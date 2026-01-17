// Rental Management Routes
import { Router } from 'express';
import { RentalController } from './rentals.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const rentalController = new RentalController();

router.use(authenticate);

router.post('/', rentalController.createRental);
router.get('/', rentalController.getAllRentals);
router.get('/:id', rentalController.getRentalById);
router.put('/:id', rentalController.updateRental);
router.post('/:id/return', rentalController.returnAsset);
router.post('/:id/convert-to-sale', rentalController.convertToSale);
router.get('/active/list', rentalController.getActiveRentals);

export default router;



