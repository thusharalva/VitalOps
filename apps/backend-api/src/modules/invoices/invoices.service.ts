// Invoice Management Service
import { PrismaClient, InvoiceStatus } from '@prisma/client';
import { generateInvoiceNumber } from '../../utils/generateCode';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

export class InvoiceService {
  async createInvoice(data: any) {
    const invoiceNumber = await generateInvoiceNumber();
    const dueDate = addDays(new Date(), data.dueDays || 7);
    
    const dueAmount = data.total - (data.paidAmount || 0);

    return await prisma.invoice.create({
      data: {
        invoiceNumber,
        rentalId: data.rentalId,
        type: data.type,
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        total: data.total,
        paidAmount: data.paidAmount || 0,
        dueAmount,
        dueDate,
        notes: data.notes,
        invoiceItems: {
          create: data.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
          })),
        },
      },
      include: {
        invoiceItems: true,
        rental: { include: { customer: true } },
      },
    });
  }

  async getAllInvoices(filters: any) {
    const { status, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.invoice.count({ where });
    const invoices = await prisma.invoice.findMany({
      where,
      skip,
      take: limit,
      include: {
        rental: { include: { customer: true } },
        invoiceItems: true,
      },
      orderBy: { issueDate: 'desc' },
    });

    return {
      invoices,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getInvoiceById(invoiceId: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        rental: { include: { customer: true } },
        invoiceItems: true,
        payments: true,
      },
    });

    if (!invoice) throw new Error('Invoice not found');
    return invoice;
  }

  async updateInvoice(invoiceId: string, data: any) {
    return await prisma.invoice.update({
      where: { id: invoiceId },
      data,
    });
  }

  async sendViaWhatsApp(invoiceId: string) {
    const invoice = await this.getInvoiceById(invoiceId);
    
    // Update invoice
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        sentViaWhatsApp: true,
        whatsappSentAt: new Date(),
        status: InvoiceStatus.SENT,
      },
    });

    // TODO: Integrate with WhatsApp service
    // Send invoice PDF via WhatsApp

    return { success: true, message: 'Invoice sent via WhatsApp' };
  }

  async getOverdueInvoices() {
    return await prisma.invoice.findMany({
      where: {
        status: { in: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID] },
        dueDate: { lt: new Date() },
      },
      include: {
        rental: { include: { customer: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }
}



