// Payment Management Controller
import { Response } from 'express';
import { PaymentService } from './payments.service';
import { AuthRequest } from '../../middleware/auth';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  createPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const payment = await this.paymentService.createPayment(req.body, userId);
      res.status(201).json({ success: true, message: 'Payment recorded', data: payment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllPayments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await this.paymentService.getAllPayments({
        page: Number(page),
        limit: Number(limit),
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getPaymentById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const payment = await this.paymentService.getPaymentById(req.params.id);
      res.status(200).json({ success: true, data: payment });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  getDailyPaymentReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { date } = req.query;
      const report = await this.paymentService.getDailyPaymentReport(
        date ? new Date(date as string) : new Date()
      );
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}



