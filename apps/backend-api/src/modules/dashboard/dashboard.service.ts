// Dashboard & Reports Service
import { PrismaClient, AssetStatus, RentalStatus, InvoiceStatus } from '@prisma/client';
import { startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export class DashboardService {
  async getOverview() {
    const [
      totalAssets,
      availableAssets,
      rentedAssets,
      activeRentals,
      totalCustomers,
      pendingInvoices,
      overdueInvoices,
      todayJobs,
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: AssetStatus.AVAILABLE } }),
      prisma.asset.count({ where: { status: AssetStatus.RENTED } }),
      prisma.rental.count({ where: { status: RentalStatus.ACTIVE } }),
      prisma.customer.count(),
      prisma.invoice.count({
        where: { status: { in: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID] } },
      }),
      prisma.invoice.count({
        where: {
          status: { in: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID] },
          dueDate: { lt: new Date() },
        },
      }),
      prisma.job.count({
        where: {
          scheduledDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
    ]);

    return {
      assets: {
        total: totalAssets,
        available: availableAssets,
        rented: rentedAssets,
        utilizationRate: totalAssets > 0 ? (rentedAssets / totalAssets) * 100 : 0,
      },
      rentals: {
        active: activeRentals,
      },
      customers: {
        total: totalCustomers,
      },
      invoices: {
        pending: pendingInvoices,
        overdue: overdueInvoices,
      },
      jobs: {
        today: todayJobs,
      },
    };
  }

  async getStats() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [monthlyRevenue, monthlySales, monthlyPayments] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          paymentDate: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
      prisma.sale.count({
        where: {
          saleDate: { gte: monthStart, lte: monthEnd },
        },
      }),
      prisma.payment.count({
        where: {
          paymentDate: { gte: monthStart, lte: monthEnd },
        },
      }),
    ]);

    return {
      currentMonth: {
        revenue: monthlyRevenue._sum.amount || 0,
        sales: monthlySales,
        payments: monthlyPayments,
      },
    };
  }

  async getRecentActivity(limit: number) {
    const activities = await prisma.activityLog.findMany({
      take: limit,
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return activities;
  }
}



