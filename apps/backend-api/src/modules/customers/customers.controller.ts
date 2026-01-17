// Customer Management Controller
import { Response } from 'express';
import { CustomerService } from './customers.service';
import { AuthRequest } from '../../middleware/auth';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  createCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const customer = await this.customerService.createCustomer(req.body);
      res.status(201).json({ success: true, message: 'Customer created', data: customer });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const result = await this.customerService.getAllCustomers({
        search: search as string,
        page: Number(page),
        limit: Number(limit),
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getCustomerById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const customer = await this.customerService.getCustomerById(req.params.id);
      res.status(200).json({ success: true, data: customer });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  updateCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const customer = await this.customerService.updateCustomer(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Customer updated', data: customer });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.customerService.deleteCustomer(req.params.id);
      res.status(200).json({ success: true, message: 'Customer deleted' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getCustomerRentals = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rentals = await this.customerService.getCustomerRentals(req.params.id);
      res.status(200).json({ success: true, data: rentals });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getCustomerPayments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const payments = await this.customerService.getCustomerPayments(req.params.id);
      res.status(200).json({ success: true, data: payments });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}



