import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// eSewa endpoints
router.post('/esewa/initiate', requireAuth, PaymentController.initiateEsewa);
router.post('/esewa/verify', requireAuth, PaymentController.verifyEsewa);

// Khalti endpoints
router.post('/khalti/initiate', requireAuth, PaymentController.initiateKhalti);
router.post('/khalti/verify', requireAuth, PaymentController.verifyKhalti);

// Cash payment confirmation
router.post('/cash/confirm', requireAuth, PaymentController.confirmCashPayment);

export default router;

