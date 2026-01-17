// Asset Management Controller
import { Response } from 'express';
import { AssetService } from './assets.service';
import { AuthRequest } from '../../middleware/auth';

export class AssetController {
  private assetService: AssetService;

  constructor() {
    this.assetService = new AssetService();
  }

  /**
   * Create new asset
   * POST /api/v1/assets
   */
  createAsset = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const asset = await this.assetService.createAsset(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Asset created successfully',
        data: asset,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get all assets with filters
   * GET /api/v1/assets
   */
  getAllAssets = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status, categoryId, search, page = 1, limit = 20 } = req.query;

      const result = await this.assetService.getAllAssets({
        status: status as string,
        categoryId: categoryId as string,
        search: search as string,
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get asset by ID
   * GET /api/v1/assets/:id
   */
  getAssetById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const asset = await this.assetService.getAssetById(req.params.id);

      res.status(200).json({
        success: true,
        data: asset,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Update asset
   * PUT /api/v1/assets/:id
   */
  updateAsset = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const asset = await this.assetService.updateAsset(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Asset updated successfully',
        data: asset,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Delete asset
   * DELETE /api/v1/assets/:id
   */
  deleteAsset = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.assetService.deleteAsset(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Asset deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Scan asset QR code
   * POST /api/v1/assets/:id/scan
   */
  scanAsset = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { location, latitude, longitude } = req.body;

      const asset = await this.assetService.scanAsset(req.params.id, {
        location,
        latitude,
        longitude,
      });

      res.status(200).json({
        success: true,
        message: 'Asset scanned successfully',
        data: asset,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get asset logs
   * GET /api/v1/assets/:id/logs
   */
  getAssetLogs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const logs = await this.assetService.getAssetLogs(req.params.id);

      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Add service log
   * POST /api/v1/assets/:id/service
   */
  addServiceLog = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const log = await this.assetService.addServiceLog(req.params.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Service log added successfully',
        data: log,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Create asset category
   * POST /api/v1/assets/categories
   */
  createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const category = await this.assetService.createCategory(req.body);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get all categories
   * GET /api/v1/assets/categories/list
   */
  getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const categories = await this.assetService.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Bulk import assets
   * POST /api/v1/assets/bulk/import
   */
  bulkImport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const result = await this.assetService.bulkImport(req.body.assets, userId);

      res.status(201).json({
        success: true,
        message: `${result.count} assets imported successfully`,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get utilization report
   * GET /api/v1/assets/reports/utilization
   */
  getUtilizationReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const report = await this.assetService.getUtilizationReport();

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get available assets
   * GET /api/v1/assets/reports/available
   */
  getAvailableAssets = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const assets = await this.assetService.getAvailableAssets();

      res.status(200).json({
        success: true,
        data: assets,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}



