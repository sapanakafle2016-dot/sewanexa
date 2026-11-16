import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { phoneAuthSchema, verifyOtpSchema, updateProfileSchema, googleAuthSchema } from '@sewanexa/validation';
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
   * Verify OTP and log in / register user (Supports Local SMS OTP and Firebase Phone Auth idTokens)
   */
  static async verifyOtp(req: AuthRequest, res: Response): Promise<void> {
    const validated = verifyOtpSchema.parse(req.body);
    let normalizedPhone = validated.phoneNumber.replace(/^(\+?977[- ]?)/, '');

    let isValid = false;

    // Check Firebase Phone Auth idToken if provided
    if (validated.firebaseIdToken) {
      try {
        const parts = validated.firebaseIdToken.split('.');
        if (parts.length === 3) {
          const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
          const payload = JSON.parse(payloadJson);
          if (payload.phone_number) {
            normalizedPhone = payload.phone_number.replace(/^(\+?977[- ]?)/, '');
            isValid = true;
          }
        }
      } catch (fbErr) {
        console.warn('[Firebase Auth] Failed to decode firebaseIdToken:', fbErr);
      }
    }

    // Fallback / standard OTP verification via OtpService
    if (!isValid && validated.otp) {
      isValid = OtpService.verifyOtp(normalizedPhone, validated.otp);
    }

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
      return;
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber: normalizedPhone });
    let isNewUser = false;

    const isAdminPhone =
      normalizedPhone === '9800000000' ||
      normalizedPhone === '9800000001' ||
      normalizedPhone === '9800000002';

    if (!user) {
      isNewUser = true;
      user = await User.create({
        phoneNumber: normalizedPhone,
        isPhoneVerified: true,
        role: isAdminPhone ? 'superadmin' : 'customer',
        name: isAdminPhone ? 'SEWANEXA Super Admin' : `User ${normalizedPhone.slice(-4)}`,
      });
    } else {
      user.isPhoneVerified = true;
      if (isAdminPhone && user.role !== 'admin' && user.role !== 'superadmin') {
        user.role = 'superadmin';
      }
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
   * Google / Gmail Social Login (Supports Google Identity Services credential idToken & OAuth info)
   */
  static async googleLogin(req: AuthRequest, res: Response): Promise<void> {
    const validated = googleAuthSchema.parse(req.body);
    let email = validated.email?.toLowerCase().trim();
    let name = validated.name?.trim();
    let avatarUrl = validated.avatarUrl;
    let googleId = validated.googleId;

    // If an idToken (Google JWT) is provided from Google Identity Services (GIS) on web/mobile:
    if (validated.idToken) {
      try {
        const parts = validated.idToken.split('.');
        if (parts.length === 3) {
          const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
          const payload = JSON.parse(payloadJson);
          if (payload.email) {
            email = payload.email.toLowerCase().trim();
          }
          if (payload.name && !name) {
            name = payload.name;
          }
          if (payload.picture && !avatarUrl) {
            avatarUrl = payload.picture;
          }
          if (payload.sub && !googleId) {
            googleId = payload.sub;
          }
        }
      } catch (tokenParseErr) {
        console.warn('[Google Auth] Failed to parse idToken payload:', tokenParseErr);
      }
    }

    if (!email) {
      res.status(400).json({ success: false, message: 'Valid Gmail/Google email is required' });
      return;
    }

    if (!name) {
      name = email.split('@')[0];
    }

    // Check if user exists with this email or googleId
    let user = await User.findOne({
      $or: [{ email }, ...(googleId ? [{ googleId }] : [])],
    });

    let isNewUser = false;
    const isAdminEmail =
      email === 'admin@sewanexa.com' ||
      email === 'superadmin@sewanexa.com' ||
      email === 'sajankafle@gmail.com';

    if (!user) {
      isNewUser = true;
      user = await User.create({
        email,
        name,
        avatarUrl,
        googleId,
        isPhoneVerified: false,
        role: isAdminEmail ? 'superadmin' : 'customer',
      });
    } else {
      if (!user.email) user.email = email;
      if (googleId && !user.googleId) user.googleId = googleId;
      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      if (name && !user.name) user.name = name;
      if (isAdminEmail && user.role !== 'admin' && user.role !== 'superadmin') {
        user.role = 'superadmin';
      }
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    const providerProfile = await ProviderProfile.findOne({ userId: user._id });

    res.json({
      success: true,
      message: isNewUser ? 'Welcome to Sewanexa! Registered with Gmail.' : 'Logged in successfully with Gmail.',
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

