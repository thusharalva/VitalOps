// Invoice Management Controller
import { Response } from 'express';
import { InvoiceService } from './invoices.service';
import { AuthRequest } from '../../middleware/auth';

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  createInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const invoice = await this.invoiceService.createInvoice(req.body);
      res.status(201).json({ success: true, message: 'Invoice created', data: invoice });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const result = await this.invoiceService.getAllInvoices({
        status: status as string,
        page: Number(page),
        limit: Number(limit),
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getInvoiceById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const invoice = await this.invoiceService.getInvoiceById(req.params.id);
      res.status(200).json({ success: true, data: invoice });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  updateInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const invoice = await this.invoiceService.updateInvoice(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Invoice updated', data: invoice });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  sendViaWhatsApp = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await this.invoiceService.sendViaWhatsApp(req.params.id);
      res.status(200).json({ success: true, message: 'Invoice sent via WhatsApp', data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getOverdueInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const invoices = await this.invoiceService.getOverdueInvoices();
      res.status(200).json({ success: true, data: invoices });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}



