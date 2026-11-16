import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireAdmin);

router.get('/dashboard-stats', AdminController.getDashboardStats);
router.get('/pending-providers', AdminController.getPendingProviders);
router.post('/providers/:providerId/review', AdminController.reviewProviderVerification);

// ─── Providers Management ────────────────────────────────
router.get('/providers', AdminController.getAllProviders);
router.put('/providers/:id/status', AdminController.updateProviderStatus);

// ─── Users / Customers Management ────────────────────────
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id/status', AdminController.updateUserStatus);

// ─── Financials & Payouts ────────────────────────────────
router.get('/financials', AdminController.getFinancialOverview);

router.get('/bookings', AdminController.listAllBookings);

// ─── Dynamic Services & Categories Management ───────────
router.get('/categories', AdminController.listAllCategoriesAdmin);
router.post('/categories', AdminController.createCategory);
router.put('/categories/:id', AdminController.updateCategory);
router.delete('/categories/:id', AdminController.deleteCategory);

router.post('/subcategories', AdminController.createSubCategory);
router.put('/subcategories/:id', AdminController.updateSubCategory);
router.delete('/subcategories/:id', AdminController.deleteSubCategory);

export default router;

