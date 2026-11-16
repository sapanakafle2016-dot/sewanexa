import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/google', AuthController.googleLogin);
router.get('/me', requireAuth, AuthController.getMe);
router.put('/profile', requireAuth, AuthController.updateProfile);

export default router;

