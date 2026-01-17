// Payment Management Service
import { PrismaClient, InvoiceStatus } from '@prisma/client';
import { generatePaymentNumber } from '../../utils/generateCode';
import { startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

export class PaymentService {
  async createPayment(data: any, recordedBy?: string) {
    const paymentNumber = await generatePaymentNumber();

    const payment = await prisma.payment.create({
      data: {
        paymentNumber,
        invoiceId: data.invoiceId,
        rentalId: data.rentalId,
        saleId: data.saleId,
        customerId: data.customerId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
        transactionId: data.transactionId,
        upiId: data.upiId,
        bankReference: data.bankReference,
        proofImageUrl: data.proofImageUrl,
        notes: data.notes,
        recordedBy,
      },
      include: {
        customer: true,
        invoice: true,
      },
    });

    // Update invoice if payment is linked to invoice
    if (data.invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: data.invoiceId },
      });

      if (invoice) {
        const newPaidAmount = Number(invoice.paidAmount) + Number(data.amount);
        const newDueAmount = Number(invoice.total) - newPaidAmount;

        let newStatus = invoice.status;
        if (newDueAmount <= 0) {
          newStatus = InvoiceStatus.PAID;
        } else if (newPaidAmount > 0) {
          newStatus = InvoiceStatus.PARTIALLY_PAID;
        }

        await prisma.invoice.update({
          where: { id: data.invoiceId },
          data: {
            paidAmount: newPaidAmount,
            dueAmount: newDueAmount,
            status: newStatus,
            paidDate: newDueAmount <= 0 ? new Date() : null,
          },
        });
      }
    }

    return payment;
  }

  async getAllPayments(filters: any) {
    const { page, limit } = filters;
    const skip = (page - 1) * limit;

    const total = await prisma.payment.count();
    const payments = await prisma.payment.findMany({
      skip,
      take: limit,
      include: {
        customer: true,
        invoice: true,
      },
      orderBy: { paymentDate: 'desc' },
    });

    return {
      payments,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPaymentById(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        customer: true,
        invoice: true,
        rental: true,
        sale: true,
      },
    });

    if (!payment) throw new Error('Payment not found');
    return payment;
  }

  async getDailyPaymentReport(date: Date) {
    const payments = await prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      include: {
        customer: true,
      },
    });

    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    
    const byMethod = payments.reduce((acc: any, p) => {
      acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + Number(p.amount);
      return acc;
    }, {});

    return {
      date: date.toISOString().split('T')[0],
      totalPayments: payments.length,
      totalAmount,
      byMethod,
      payments,
    };
  }
}



