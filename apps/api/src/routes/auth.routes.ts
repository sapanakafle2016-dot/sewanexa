import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.get('/me', requireAuth, AuthController.getMe);
router.put('/profile', requireAuth, AuthController.updateProfile);

export default router;

