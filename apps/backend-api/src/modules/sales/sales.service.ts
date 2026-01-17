// Sales Management Service
import { PrismaClient, AssetStatus } from '@prisma/client';
import { generateSaleNumber } from '../../utils/generateCode';
import { startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export class SaleService {
  async createSale(data: any) {
    const saleNumber = await generateSaleNumber();
    const finalPrice = data.salePrice - (data.discount || 0);

    const sale = await prisma.sale.create({
      data: {
        saleNumber,
        customerId: data.customerId,
        assetId: data.assetId,
        saleType: data.saleType || 'DIRECT_SALE',
        salePrice: data.salePrice,
        discount: data.discount || 0,
        finalPrice,
        notes: data.notes,
      },
      include: {
        customer: true,
        asset: true,
      },
    });

    // Update asset status to SOLD
    await prisma.asset.update({
      where: { id: data.assetId },
      data: { status: AssetStatus.SOLD },
    });

    // Create asset log
    await prisma.assetLog.create({
      data: {
        assetId: data.assetId,
        action: 'SOLD',
        description: `Asset sold to ${sale.customer.name} for ₹${finalPrice}`,
      },
    });

    return sale;
  }

  async getAllSales(filters: { page: number; limit: number }) {
    const { page, limit } = filters;
    const skip = (page - 1) * limit;

    const total = await prisma.sale.count();
    const sales = await prisma.sale.findMany({
      skip,
      take: limit,
      include: {
        customer: true,
        asset: { include: { category: true } },
      },
      orderBy: { saleDate: 'desc' },
    });

    return {
      sales,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSaleById(saleId: string) {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        customer: true,
        asset: { include: { category: true } },
        payments: true,
      },
    });

    if (!sale) throw new Error('Sale not found');
    return sale;
  }

  async getMonthlySalesReport() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.finalPrice), 0);

    return {
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalSales,
      totalRevenue,
      sales,
    };
  }
}



