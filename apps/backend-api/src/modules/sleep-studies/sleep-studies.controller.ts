// Sleep Study Management Controller
import { Response } from 'express';
import { SleepStudyService } from './sleep-studies.service';
import { AuthRequest } from '../../middleware/auth';

export class SleepStudyController {
  private sleepStudyService: SleepStudyService;

  constructor() {
    this.sleepStudyService = new SleepStudyService();
  }

  createSleepStudy = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const study = await this.sleepStudyService.createSleepStudy(req.body);
      res.status(201).json({ success: true, message: 'Sleep study created', data: study });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllSleepStudies = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const result = await this.sleepStudyService.getAllSleepStudies({
        status: status as string,
        page: Number(page),
        limit: Number(limit),
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getSleepStudyById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const study = await this.sleepStudyService.getSleepStudyById(req.params.id);
      res.status(200).json({ success: true, data: study });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  updateSleepStudy = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const study = await this.sleepStudyService.updateSleepStudy(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Sleep study updated', data: study });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  uploadReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const study = await this.sleepStudyService.uploadReport(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Report uploaded', data: study });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  sendRecommendation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await this.sleepStudyService.sendRecommendation(req.params.id);
      res.status(200).json({ success: true, message: 'Recommendation sent', data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}



