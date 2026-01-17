// Technician Job Management Service
import { PrismaClient, JobStatus } from '@prisma/client';
import { generateJobNumber } from '../../utils/generateCode';
import { startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

export class JobService {
  async createJob(data: any) {
    const jobNumber = await generateJobNumber();

    return await prisma.job.create({
      data: {
        jobNumber,
        type: data.type,
        technicianId: data.technicianId,
        customerId: data.customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        scheduledDate: new Date(data.scheduledDate),
        scheduledTime: data.scheduledTime,
        description: data.description,
        amountToCollect: data.amountToCollect,
        notes: data.notes,
      },
      include: {
        technician: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async getAllJobs(filters: any) {
    const { status, type, technicianId, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (technicianId) where.technicianId = technicianId;

    const total = await prisma.job.count({ where });
    const jobs = await prisma.job.findMany({
      where,
      skip,
      take: limit,
      include: {
        technician: { select: { id: true, name: true } },
      },
      orderBy: { scheduledDate: 'desc' },
    });

    return {
      jobs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getJobById(jobId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        technician: true,
      },
    });

    if (!job) throw new Error('Job not found');
    return job;
  }

  async updateJob(jobId: string, data: any) {
    return await prisma.job.update({
      where: { id: jobId },
      data,
    });
  }

  async startJob(jobId: string, data: { qrScan?: string }) {
    return await prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.IN_PROGRESS,
        startedAt: new Date(),
        startQrScan: data.qrScan,
      },
    });
  }

  async completeJob(jobId: string, data: any) {
    return await prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.COMPLETED,
        completedAt: new Date(),
        endQrScan: data.qrScan,
        amountCollected: data.amountCollected,
        paymentMethod: data.paymentMethod,
        paymentProofUrl: data.paymentProofUrl,
        notes: data.notes,
        images: data.images || [],
      },
    });
  }

  async getTechnicianTodayJobs(technicianId: string) {
    const today = new Date();
    
    return await prisma.job.findMany({
      where: {
        technicianId,
        scheduledDate: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }
}



