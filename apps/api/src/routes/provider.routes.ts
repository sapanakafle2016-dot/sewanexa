import { Router } from 'express';
import { ProviderController } from '../controllers/provider.controller.js';
import { requireAuth, requireProvider } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/nearby', ProviderController.searchNearby);
router.get('/:id', ProviderController.getById);

// Protected provider registration
router.post('/register', requireAuth, ProviderController.register);

// Protected provider operations
router.put('/toggle-online', requireAuth, requireProvider, ProviderController.toggleOnlineStatus);
router.put('/update-location', requireAuth, requireProvider, ProviderController.updateLocation);

export default router;

