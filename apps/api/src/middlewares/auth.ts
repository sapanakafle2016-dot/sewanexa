import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User, IUserDocument } from '../models/User.js';
import { ProviderProfile, IProviderProfileDocument } from '../models/ProviderProfile.js';

export interface AuthRequest extends Request {
  user?: IUserDocument;
  provider?: IProviderProfileDocument;
}

interface JwtPayload {
  userId: string;
  role: string;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found. Token is invalid.' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ success: false, message: 'Your account has been suspended.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireProvider = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  const provider = await ProviderProfile.findOne({ userId: req.user._id });
  if (!provider) {
    res.status(403).json({
      success: false,
      message: 'Access denied. You must be registered as a service provider.',
    });
    return;
  }

  req.provider = provider;
  next();
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    res.status(403).json({ success: false, message: 'Admin privileges required.' });
    return;
  }

  next();
};
