// Dashboard & Reports Controller
import { Response } from 'express';
import { DashboardService } from './dashboard.service';
import { AuthRequest } from '../../middleware/auth';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getOverview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const overview = await this.dashboardService.getOverview();
      res.status(200).json({ success: true, data: overview });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.dashboardService.getStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getRecentActivity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { limit = 20 } = req.query;
      const activity = await this.dashboardService.getRecentActivity(Number(limit));
      res.status(200).json({ success: true, data: activity });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}



