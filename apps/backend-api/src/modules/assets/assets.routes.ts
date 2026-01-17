// Asset Management Routes
import { Router } from 'express';
import { AssetController } from './assets.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const assetController = new AssetController();

// All routes require authentication
router.use(authenticate);

// Asset CRUD operations
router.post('/', assetController.createAsset);
router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', authorize(['ADMIN']), assetController.deleteAsset);

// Asset operations
router.post('/:id/scan', assetController.scanAsset);
router.get('/:id/logs', assetController.getAssetLogs);
router.post('/:id/service', assetController.addServiceLog);

// Asset categories
router.post('/categories', authorize(['ADMIN', 'MANAGER']), assetController.createCategory);
router.get('/categories/list', assetController.getCategories);

// Bulk operations
router.post('/bulk/import', authorize(['ADMIN', 'MANAGER']), assetController.bulkImport);

// Reports
router.get('/reports/utilization', assetController.getUtilizationReport);
router.get('/reports/available', assetController.getAvailableAssets);

export default router;



