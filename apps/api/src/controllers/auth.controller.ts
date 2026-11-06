import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { phoneAuthSchema, verifyOtpSchema, updateProfileSchema } from '@sewanexa/validation';
import { User } from '../models/User.js';
import { ProviderProfile } from '../models/ProviderProfile.js';
import { OtpService } from '../services/otp.service.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middlewares/auth.js';

export class AuthController {
  /**
   * Request OTP for Nepal mobile number
   */
  static async sendOtp(req: AuthRequest, res: Response): Promise<void> {
    const validated = phoneAuthSchema.parse(req.body);
    // Normalize phone number (strip +977 or spaces)
    const normalizedPhone = validated.phoneNumber.replace(/^(\+?977[- ]?)/, '');

    const otp = OtpService.generateOtp(normalizedPhone);
    const sent = await OtpService.sendOtp(normalizedPhone, otp);

    if (!sent) {
      res.status(500).json({ success: false, message: 'Failed to dispatch SMS OTP. Try again.' });
      return;
    }

    res.json({
      success: true,
      message: `Verification code sent to +977 ${normalizedPhone}`,
      phoneNumber: normalizedPhone,
      // In dev mode, return otp for convenience
      ...(config.nodeEnv === 'development' ? { devOtp: otp } : {}),
    });
  }

  /**
   * Verify OTP and log in / register user
   */
  static async verifyOtp(req: AuthRequest, res: Response): Promise<void> {
    const validated = verifyOtpSchema.parse(req.body);
    const normalizedPhone = validated.phoneNumber.replace(/^(\+?977[- ]?)/, '');

    const isValid = OtpService.verifyOtp(normalizedPhone, validated.otp);
    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
      return;
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber: normalizedPhone });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        phoneNumber: normalizedPhone,
        isPhoneVerified: true,
        role: 'customer',
        name: `User ${normalizedPhone.slice(-4)}`,
      });
    } else {
      user.isPhoneVerified = true;
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    // Check if provider profile exists
    const providerProfile = await ProviderProfile.findOne({ userId: user._id });

    res.json({
      success: true,
      message: isNewUser ? 'Account created successfully' : 'Logged in successfully',
      token,
      user,
      isProvider: !!providerProfile,
      providerProfile,
    });
  }

  /**
   * Get authenticated user profile
   */
  static async getMe(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const providerProfile = await ProviderProfile.findOne({ userId: req.user._id })
      .populate('categories')
      .populate('subCategories');

    res.json({
      success: true,
      user: req.user,
      isProvider: !!providerProfile,
      providerProfile,
    });
  }

  /**
   * Update profile details
   */
  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const validated = updateProfileSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, { $set: validated }, { new: true });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  }
}
