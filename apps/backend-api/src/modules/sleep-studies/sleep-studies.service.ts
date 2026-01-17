// Sleep Study Management Service
import { PrismaClient, SleepStudyStatus } from '@prisma/client';
import { generateSleepStudyNumber } from '../../utils/generateCode';

const prisma = new PrismaClient();

export class SleepStudyService {
  async createSleepStudy(data: any) {
    const studyNumber = await generateSleepStudyNumber();

    return await prisma.sleepStudy.create({
      data: {
        studyNumber,
        customerId: data.customerId,
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        doctorId: data.doctorId,
        referringDoctor: data.referringDoctor,
        assetId: data.assetId,
        studyDate: data.studyDate ? new Date(data.studyDate) : null,
        studyFee: data.studyFee,
        notes: data.notes,
      },
      include: {
        customer: true,
        doctor: true,
        asset: true,
      },
    });
  }

  async getAllSleepStudies(filters: any) {
    const { status, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.sleepStudy.count({ where });
    const studies = await prisma.sleepStudy.findMany({
      where,
      skip,
      take: limit,
      include: {
        customer: true,
        doctor: true,
        asset: true,
      },
      orderBy: { bookingDate: 'desc' },
    });

    return {
      studies,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSleepStudyById(studyId: string) {
    const study = await prisma.sleepStudy.findUnique({
      where: { id: studyId },
      include: {
        customer: true,
        doctor: true,
        asset: true,
        deliveryJob: true,
      },
    });

    if (!study) throw new Error('Sleep study not found');
    return study;
  }

  async updateSleepStudy(studyId: string, data: any) {
    return await prisma.sleepStudy.update({
      where: { id: studyId },
      data: {
        ...data,
        studyDate: data.studyDate ? new Date(data.studyDate) : undefined,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
        pickupDate: data.pickupDate ? new Date(data.pickupDate) : undefined,
      },
    });
  }

  async uploadReport(studyId: string, data: any) {
    return await prisma.sleepStudy.update({
      where: { id: studyId },
      data: {
        status: SleepStudyStatus.REPORT_UPLOADED,
        reportPdfUrl: data.reportPdfUrl,
        studyResult: data.studyResult,
        ahi: data.ahi,
        reportUploadedAt: new Date(),
      },
    });
  }

  async sendRecommendation(studyId: string) {
    const study = await prisma.sleepStudy.findUnique({
      where: { id: studyId },
      include: { customer: true },
    });

    if (!study) throw new Error('Sleep study not found');

    // Update recommendation sent flag
    await prisma.sleepStudy.update({
      where: { id: studyId },
      data: { recommendationSent: true },
    });

    // TODO: Send WhatsApp message with recommendation
    // This would integrate with WhatsApp service

    return { success: true, message: 'Recommendation sent to customer' };
  }
}



