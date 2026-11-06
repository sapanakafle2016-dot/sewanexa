import { Response } from 'express';
import { providerRegisterSchema, nearbySearchQuerySchema } from '@sewanexa/validation';
import { ProviderProfile } from '../models/ProviderProfile.js';
import { User } from '../models/User.js';
import { GeoService } from '../services/geo.service.js';
import { AuthRequest } from '../middlewares/auth.js';

export class ProviderController {
  /**
   * Register authenticated user as a Service Provider
   */
  static async register(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const existingProfile = await ProviderProfile.findOne({ userId: req.user._id });
    if (existingProfile) {
      res.status(400).json({
        success: false,
        message: 'You have already submitted a provider application.',
      });
      return;
    }

    const validated = providerRegisterSchema.parse(req.body);

    const providerProfile = await ProviderProfile.create({
      userId: req.user._id,
      ...validated,
      documents: {
        ...validated.documents,
        verificationStatus: 'pending',
      },
    });

    // Update user role to 'provider'
    await User.findByIdAndUpdate(req.user._id, { role: 'provider' });

    res.status(201).json({
      success: true,
      message: 'Provider profile registered successfully and submitted for admin verification.',
      providerProfile,
    });
  }

  /**
   * Search nearby online and verified providers
   */
  static async searchNearby(req: AuthRequest, res: Response): Promise<void> {
    const query = nearbySearchQuerySchema.parse(req.query);
    const providers = await GeoService.searchNearbyProviders(query);

    res.json({
      success: true,
      count: providers.length,
      data: providers,
    });
  }

  /**
   * Toggle provider Online / Offline availability
   */
  static async toggleOnlineStatus(req: AuthRequest, res: Response): Promise<void> {
    if (!req.provider) {
      res.status(403).json({ success: false, message: 'Provider profile required' });
      return;
    }

    const { isOnline } = req.body;
    req.provider.isOnline = typeof isOnline === 'boolean' ? isOnline : !req.provider.isOnline;
    await req.provider.save();

    res.json({
      success: true,
      message: `Status updated to ${req.provider.isOnline ? 'Online' : 'Offline'}`,
      isOnline: req.provider.isOnline,
    });
  }

  /**
   * Update provider current GPS coordinates
   */
  static async updateLocation(req: AuthRequest, res: Response): Promise<void> {
    if (!req.provider) {
      res.status(403).json({ success: false, message: 'Provider profile required' });
      return;
    }

    const { longitude, latitude } = req.body;
    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      res.status(400).json({ success: false, message: 'Valid longitude and latitude are required' });
      return;
    }

    req.provider.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    await req.provider.save();

    res.json({
      success: true,
      message: 'Location updated successfully',
      location: req.provider.location,
    });
  }

  /**
   * Get public profile of a provider by ID
   */
  static async getById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;

    const provider = await ProviderProfile.findById(id)
      .populate('userId', 'name phoneNumber avatarUrl')
      .populate('categories', 'name slug icon')
      .populate('subCategories', 'name slug icon suggestedBasePrice');

    if (!provider) {
      res.status(404).json({ success: false, message: 'Service provider not found' });
      return;
    }

    res.json({
      success: true,
      data: provider,
    });
  }
}
