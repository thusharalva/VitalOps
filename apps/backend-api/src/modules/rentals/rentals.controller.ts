// Rental Management Controller
import { Response } from 'express';
import { RentalService } from './rentals.service';
import { AuthRequest } from '../../middleware/auth';

export class RentalController {
  private rentalService: RentalService;

  constructor() {
    this.rentalService = new RentalService();
  }

  createRental = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rental = await this.rentalService.createRental(req.body);
      res.status(201).json({ success: true, message: 'Rental created', data: rental });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllRentals = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const result = await this.rentalService.getAllRentals({
        status: status as string,
        page: Number(page),
        limit: Number(limit),
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getRentalById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rental = await this.rentalService.getRentalById(req.params.id);
      res.status(200).json({ success: true, data: rental });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  updateRental = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rental = await this.rentalService.updateRental(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Rental updated', data: rental });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  returnAsset = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await this.rentalService.returnAsset(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Asset returned', data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  convertToSale = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const sale = await this.rentalService.convertToSale(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Converted to sale', data: sale });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getActiveRentals = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rentals = await this.rentalService.getActiveRentals();
      res.status(200).json({ success: true, data: rentals });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}



