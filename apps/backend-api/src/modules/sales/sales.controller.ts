// Sales Management Controller
import { Response } from 'express';
import { SaleService } from './sales.service';
import { AuthRequest } from '../../middleware/auth';

export class SaleController {
  private saleService: SaleService;

  constructor() {
    this.saleService = new SaleService();
  }

  createSale = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const sale = await this.saleService.createSale(req.body);
      res.status(201).json({ success: true, message: 'Sale created', data: sale });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllSales = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await this.saleService.getAllSales({
        page: Number(page),
        limit: Number(limit),
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getSaleById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const sale = await this.saleService.getSaleById(req.params.id);
      res.status(200).json({ success: true, data: sale });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  getMonthlySalesReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const report = await this.saleService.getMonthlySalesReport();
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}



