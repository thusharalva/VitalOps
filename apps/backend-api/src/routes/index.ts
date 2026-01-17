// Main router - aggregates all module routes
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import assetRoutes from '../modules/assets/assets.routes';
import customerRoutes from '../modules/customers/customers.routes';
import rentalRoutes from '../modules/rentals/rentals.routes';
import saleRoutes from '../modules/sales/sales.routes';
import jobRoutes from '../modules/jobs/jobs.routes';
import sleepStudyRoutes from '../modules/sleep-studies/sleep-studies.routes';
import invoiceRoutes from '../modules/invoices/invoices.routes';
import paymentRoutes from '../modules/payments/payments.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

const router = Router();

// ============================================
// API ROUTES - All prefixed with /api/v1
// ============================================

// Authentication
router.use('/auth', authRoutes);

// User Management
router.use('/users', userRoutes);

// Core Modules
router.use('/assets', assetRoutes);
router.use('/customers', customerRoutes);
router.use('/rentals', rentalRoutes);
router.use('/sales', saleRoutes);
router.use('/jobs', jobRoutes);
router.use('/sleep-studies', sleepStudyRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);

// Dashboard & Reports
router.use('/dashboard', dashboardRoutes);

export default router;

