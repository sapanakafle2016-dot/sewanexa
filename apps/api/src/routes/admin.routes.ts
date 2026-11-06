import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireAdmin);

router.get('/dashboard-stats', AdminController.getDashboardStats);
router.get('/pending-providers', AdminController.getPendingProviders);
router.post('/providers/:providerId/review', AdminController.reviewProviderVerification);
router.get('/bookings', AdminController.listAllBookings);

export default router;

