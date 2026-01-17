// Technician Job Management Controller
import { Response } from 'express';
import { JobService } from './jobs.service';
import { AuthRequest } from '../../middleware/auth';

export class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  createJob = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const job = await this.jobService.createJob(req.body);
      res.status(201).json({ success: true, message: 'Job created', data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllJobs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status, type, technicianId, page = 1, limit = 20 } = req.query;
      const result = await this.jobService.getAllJobs({
        status: status as string,
        type: type as string,
        technicianId: technicianId as string,
        page: Number(page),
        limit: Number(limit),
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getJobById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      res.status(200).json({ success: true, data: job });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const job = await this.jobService.updateJob(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Job updated', data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  startJob = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const job = await this.jobService.startJob(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Job started', data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  completeJob = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const job = await this.jobService.completeJob(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Job completed', data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getTechnicianTodayJobs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const jobs = await this.jobService.getTechnicianTodayJobs(req.params.technicianId);
      res.status(200).json({ success: true, data: jobs });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}



