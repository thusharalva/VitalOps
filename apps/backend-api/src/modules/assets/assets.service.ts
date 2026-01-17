// Asset Management Service - Business logic
import { PrismaClient, AssetStatus, AssetCondition } from '@prisma/client';
import QRCode from 'qrcode';
import { generateAssetCode } from '../../utils/generateCode';

const prisma = new PrismaClient();

interface CreateAssetDTO {
  name: string;
  categoryId: string;
  purchaseDate: string;
  purchasePrice: number;
  depreciationRate: number;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  status?: AssetStatus;
  condition?: AssetCondition;
  currentLocation?: string;
  notes?: string;
}

interface AssetFilters {
  status?: string;
  categoryId?: string;
  search?: string;
  page: number;
  limit: number;
}

export class AssetService {
  /**
   * Create new asset with QR code
   */
  async createAsset(data: CreateAssetDTO, createdById: string) {
    // Generate unique asset code
    const assetCode = await generateAssetCode();

    // Generate QR code data (contains asset code)
    const qrCodeData = `VITALOPS:ASSET:${assetCode}`;
    const qrCode = await QRCode.toDataURL(qrCodeData);

    // Calculate current value (same as purchase price initially)
    const currentValue = data.purchasePrice;

    // Create asset
    const asset = await prisma.asset.create({
      data: {
        assetCode,
        qrCode: qrCodeData,
        name: data.name,
        categoryId: data.categoryId,
        purchaseDate: new Date(data.purchaseDate),
        purchasePrice: data.purchasePrice,
        currentValue,
        depreciationRate: data.depreciationRate,
        manufacturer: data.manufacturer,
        model: data.model,
        serialNumber: data.serialNumber,
        status: data.status || AssetStatus.AVAILABLE,
        condition: data.condition || AssetCondition.GOOD,
        currentLocation: data.currentLocation,
        notes: data.notes,
        createdById,
      },
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create initial asset log
    await prisma.assetLog.create({
      data: {
        assetId: asset.id,
        action: 'CREATED',
        description: `Asset ${assetCode} created`,
        location: data.currentLocation,
      },
    });

    return {
      ...asset,
      qrCodeImage: qrCode, // Base64 QR code image for display/download
    };
  }

  /**
   * Get all assets with filters and pagination
   */
  async getAllAssets(filters: AssetFilters) {
    const { status, categoryId, search, page, limit } = filters;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { assetCode: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.asset.count({ where });

    // Get assets
    const assets = await prisma.asset.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      assets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get asset by ID with full details
   */
  async getAssetById(assetId: string) {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rentalItems: {
          include: {
            rental: {
              include: {
                customer: true,
              },
            },
          },
          where: {
            returnedAt: null, // Currently rented
          },
        },
        assetLogs: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        serviceLogs: {
          take: 5,
          orderBy: {
            serviceDate: 'desc',
          },
        },
      },
    });

    if (!asset) {
      throw new Error('Asset not found');
    }

    // Generate QR code image for display
    const qrCodeImage = await QRCode.toDataURL(asset.qrCode);

    return {
      ...asset,
      qrCodeImage,
    };
  }

  /**
   * Update asset
   */
  async updateAsset(assetId: string, data: Partial<CreateAssetDTO>) {
    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!existingAsset) {
      throw new Error('Asset not found');
    }

    // Update asset
    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      },
      include: {
        category: true,
      },
    });

    // Create log entry
    await prisma.assetLog.create({
      data: {
        assetId: asset.id,
        action: 'UPDATED',
        description: `Asset ${asset.assetCode} updated`,
      },
    });

    return asset;
  }

  /**
   * Delete asset (soft delete by marking as RETIRED)
   */
  async deleteAsset(assetId: string) {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new Error('Asset not found');
    }

    // Check if asset is currently rented
    const activeRental = await prisma.rentalItem.findFirst({
      where: {
        assetId,
        returnedAt: null,
      },
    });

    if (activeRental) {
      throw new Error('Cannot delete asset that is currently rented');
    }

    // Mark as retired instead of deleting
    await prisma.asset.update({
      where: { id: assetId },
      data: {
        status: AssetStatus.RETIRED,
      },
    });

    await prisma.assetLog.create({
      data: {
        assetId,
        action: 'RETIRED',
        description: `Asset ${asset.assetCode} retired/deleted`,
      },
    });

    return true;
  }

  /**
   * Scan asset and update location
   */
  async scanAsset(
    assetId: string,
    data: { location?: string; latitude?: number; longitude?: number }
  ) {
    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        currentLocation: data.location,
        lastKnownLat: data.latitude,
        lastKnownLng: data.longitude,
        lastScannedAt: new Date(),
      },
      include: {
        category: true,
      },
    });

    // Create log entry
    await prisma.assetLog.create({
      data: {
        assetId,
        action: 'SCANNED',
        description: `Asset scanned at ${data.location || 'unknown location'}`,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    return asset;
  }

  /**
   * Get asset logs
   */
  async getAssetLogs(assetId: string) {
    return await prisma.assetLog.findMany({
      where: { assetId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Add service log
   */
  async addServiceLog(assetId: string, data: any) {
    const log = await prisma.serviceLog.create({
      data: {
        assetId,
        serviceType: data.serviceType,
        description: data.description,
        technicianName: data.technicianName,
        cost: data.cost,
        nextServiceDue: data.nextServiceDue ? new Date(data.nextServiceDue) : undefined,
        notes: data.notes,
        images: data.images || [],
      },
    });

    // Create asset log entry
    await prisma.assetLog.create({
      data: {
        assetId,
        action: 'SERVICED',
        description: `Service: ${data.serviceType} - ${data.description}`,
      },
    });

    return log;
  }

  /**
   * Create asset category
   */
  async createCategory(data: { name: string; description?: string }) {
    return await prisma.assetCategory.create({
      data,
    });
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return await prisma.assetCategory.findMany({
      include: {
        _count: {
          select: {
            assets: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Bulk import assets
   */
  async bulkImport(assets: CreateAssetDTO[], createdById: string) {
    const created = [];

    for (const assetData of assets) {
      const asset = await this.createAsset(assetData, createdById);
      created.push(asset);
    }

    return {
      count: created.length,
      assets: created,
    };
  }

  /**
   * Get asset utilization report
   */
  async getUtilizationReport() {
    const statuses = await prisma.asset.groupBy({
      by: ['status'],
      _count: true,
    });

    const totalAssets = await prisma.asset.count();
    const availableAssets = await prisma.asset.count({
      where: { status: AssetStatus.AVAILABLE },
    });
    const rentedAssets = await prisma.asset.count({
      where: { status: AssetStatus.RENTED },
    });

    return {
      totalAssets,
      availableAssets,
      rentedAssets,
      utilizationRate: totalAssets > 0 ? (rentedAssets / totalAssets) * 100 : 0,
      statusBreakdown: statuses,
    };
  }

  /**
   * Get available assets
   */
  async getAvailableAssets() {
    return await prisma.asset.findMany({
      where: {
        status: AssetStatus.AVAILABLE,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}



