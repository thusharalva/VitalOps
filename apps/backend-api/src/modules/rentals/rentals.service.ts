// Rental Management Service
import { PrismaClient, AssetStatus, RentalStatus } from '@prisma/client';
import { generateRentalNumber, generateSaleNumber } from '../../utils/generateCode';
import { addMonths } from 'date-fns';

const prisma = new PrismaClient();

export class RentalService {
  async createRental(data: any) {
    const rentalNumber = await generateRentalNumber();
    
    // CRITICAL: Check if all selected assets are actually AVAILABLE
    const assets = await prisma.asset.findMany({
      where: { id: { in: data.assetIds } },
      select: { id: true, assetCode: true, name: true, status: true },
    });

    const unavailableAssets = assets.filter(asset => asset.status !== AssetStatus.AVAILABLE);
    
    if (unavailableAssets.length > 0) {
      const assetNames = unavailableAssets.map(a => `${a.name} (${a.assetCode})`).join(', ');
      throw new Error(`Cannot rent these assets - already rented or not available: ${assetNames}`);
    }

    // Calculate next billing date
    const nextBillingDate = addMonths(new Date(), 1);

    const rental = await prisma.rental.create({
      data: {
        rentalNumber,
        customerId: data.customerId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        monthlyRent: data.monthlyRent,
        securityDeposit: data.securityDeposit,
        billingDay: data.billingDay || 1,
        nextBillingDate,
        notes: data.notes,
        rentalItems: {
          create: data.assetIds.map((assetId: string) => ({
            assetId,
            rentedLocation: data.location,
            rentedLat: data.latitude,
            rentedLng: data.longitude,
          })),
        },
      },
      include: {
        customer: true,
        rentalItems: { include: { asset: true } },
      },
    });

    // Update asset statuses to RENTED
    await prisma.asset.updateMany({
      where: { id: { in: data.assetIds } },
      data: { status: AssetStatus.RENTED },
    });

    // Create asset logs
    for (const assetId of data.assetIds) {
      await prisma.assetLog.create({
        data: {
          assetId,
          action: 'RENTED',
          description: `Asset rented to ${rental.customer.name} (${rentalNumber})`,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      });
    }

    return rental;
  }

  async getAllRentals(filters: { status?: string; page: number; limit: number }) {
    const { status, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.rental.count({ where });
    const rentals = await prisma.rental.findMany({
      where,
      skip,
      take: limit,
      include: {
        customer: true,
        rentalItems: { include: { asset: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      rentals,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getRentalById(rentalId: string) {
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: {
        customer: true,
        rentalItems: { include: { asset: true } },
        payments: { orderBy: { paymentDate: 'desc' } },
        invoices: { orderBy: { issueDate: 'desc' } },
      },
    });

    if (!rental) throw new Error('Rental not found');
    return rental;
  }

  async updateRental(rentalId: string, data: any) {
    return await prisma.rental.update({
      where: { id: rentalId },
      data,
      include: {
        customer: true,
        rentalItems: { include: { asset: true } },
      },
    });
  }

  async returnAsset(rentalId: string, data: { assetId: string; location?: string; latitude?: number; longitude?: number }) {
    const rentalItem = await prisma.rentalItem.findFirst({
      where: { rentalId, assetId: data.assetId, returnedAt: null },
    });

    if (!rentalItem) throw new Error('Rental item not found');

    // Update rental item
    await prisma.rentalItem.update({
      where: { id: rentalItem.id },
      data: {
        returnedAt: new Date(),
        returnedLocation: data.location,
        returnedLat: data.latitude,
        returnedLng: data.longitude,
      },
    });

    // Update asset status
    await prisma.asset.update({
      where: { id: data.assetId },
      data: { status: AssetStatus.AVAILABLE },
    });

    // Create asset log
    await prisma.assetLog.create({
      data: {
        assetId: data.assetId,
        action: 'RETURNED',
        description: 'Asset returned from rental',
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    // Check if all assets are returned - if yes, mark rental as COMPLETED
    const remainingActiveAssets = await prisma.rentalItem.count({
      where: {
        rentalId,
        returnedAt: null,
      },
    });

    if (remainingActiveAssets === 0) {
      // All assets returned - mark rental as COMPLETED
      await prisma.rental.update({
        where: { id: rentalId },
        data: { status: RentalStatus.COMPLETED },
      });
    }

    return { success: true };
  }

  async convertToSale(rentalId: string, data: { assetId: string; salePrice: number; discount?: number }) {
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: { customer: true },
    });

    if (!rental) throw new Error('Rental not found');

    const saleNumber = await generateSaleNumber();
    const finalPrice = data.salePrice - (data.discount || 0);

    const sale = await prisma.sale.create({
      data: {
        saleNumber,
        customerId: rental.customerId,
        assetId: data.assetId,
        saleType: 'RENTAL_CONVERSION',
        salePrice: data.salePrice,
        discount: data.discount || 0,
        finalPrice,
      },
    });

    // Update asset status
    await prisma.asset.update({
      where: { id: data.assetId },
      data: { status: AssetStatus.SOLD },
    });

    // Update rental status
    await prisma.rental.update({
      where: { id: rentalId },
      data: { status: RentalStatus.CONVERTED_TO_SALE },
    });

    return sale;
  }

  async getActiveRentals() {
    return await prisma.rental.findMany({
      where: { status: RentalStatus.ACTIVE },
      include: {
        customer: true,
        rentalItems: { include: { asset: true } },
      },
      orderBy: { nextBillingDate: 'asc' },
    });
  }
}

