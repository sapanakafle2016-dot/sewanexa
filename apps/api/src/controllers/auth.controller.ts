import { Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  loginSchema,
  signupSchema,
  phoneAuthSchema,
  verifyOtpSchema,
  updateProfileSchema,
} from '@sewanexa/validation';
import { User } from '../models/User.js';
import { ProviderProfile } from '../models/ProviderProfile.js';
import { OtpService } from '../services/otp.service.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middlewares/auth.js';
import { PasswordUtil } from '../utils/password.js';

export class AuthController {
  /**
   * Register a new user with Email and Password
   */
  static async register(req: AuthRequest, res: Response): Promise<void> {
    const validated = signupSchema.parse(req.body);
    const email = validated.email.toLowerCase().trim();

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
      return;
    }

    // If phone number provided, normalize and check uniqueness
    let normalizedPhone: string | undefined;
    if (validated.phoneNumber && validated.phoneNumber.trim()) {
      normalizedPhone = validated.phoneNumber.replace(/^(\+?977[- ]?)/, '').trim();
      const existingPhone = await User.findOne({ phoneNumber: normalizedPhone });
      if (existingPhone) {
        res.status(400).json({
          success: false,
          message: 'An account with this phone number already exists.',
        });
        return;
      }
    }

    const hashedPassword = PasswordUtil.hashPassword(validated.password);

    const isAdminEmail =
      email === 'admin@sewanexa.com' ||
      email === 'superadmin@sewanexa.com' ||
      email === 'sajankafle@gmail.com';

    const role = isAdminEmail ? 'superadmin' : validated.role || 'customer';

    const user = await User.create({
      name: validated.name.trim(),
      email,
      password: hashedPassword,
      ...(normalizedPhone ? { phoneNumber: normalizedPhone } : {}),
      role,
      status: 'active',
      isPhoneVerified: false,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    // If registered as provider, create empty provider profile shell
    let providerProfile = null;
    if (role === 'provider') {
      providerProfile = await ProviderProfile.create({
        userId: user._id,
        bio: 'New service provider on Sewanexa',
        categories: [],
        subCategories: [],
        skills: [],
        experienceYears: 0,
        location: {
          type: 'Point',
          coordinates: [85.324, 27.7172], // Default Kathmandu coordinates
        },
        address: {
          city: 'Kathmandu',
          areaName: 'Kathmandu Valley',
          formattedAddress: 'Kathmandu, Nepal',
        },
        pricingModel: 'fixed',
        verificationStatus: 'unsubmitted',
        isOnline: true,
      });
    }

    const sanitizedUser = user.toObject();
    delete (sanitizedUser as any).password;

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Sewanexa.',
      token,
      user: sanitizedUser,
      isProvider: !!providerProfile,
      providerProfile,
    });
  }

  /**
   * Log in with Email and Password
   */
  static async login(req: AuthRequest, res: Response): Promise<void> {
    const validated = loginSchema.parse(req.body);
    const email = validated.email.toLowerCase().trim();

    // Query user including password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check and try again.',
      });
      return;
    }

    // Verify password
    const isPasswordValid = PasswordUtil.verifyPassword(validated.password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check and try again.',
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    const providerProfile = await ProviderProfile.findOne({ userId: user._id });

    const sanitizedUser = user.toObject();
    delete (sanitizedUser as any).password;

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: sanitizedUser,
      isProvider: !!providerProfile,
      providerProfile,
    });
  }
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

