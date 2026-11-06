import { Response } from 'express';
import { User } from '../models/User.js';
import { ProviderProfile } from '../models/ProviderProfile.js';
import { Booking } from '../models/Booking.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { AuthRequest } from '../middlewares/auth.js';

export class AdminController {
  /**
   * Get overarching platform metrics & stats
   */
  static async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
    const [
      totalCustomers,
      totalProviders,
      pendingVerifications,
      verifiedProviders,
      totalBookings,
      completedBookings,
      commissionSum,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      ProviderProfile.countDocuments(),
      ProviderProfile.countDocuments({ 'documents.verificationStatus': 'pending' }),
      ProviderProfile.countDocuments({ 'documents.verificationStatus': 'verified' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'completed' }),
      WalletTransaction.aggregate([
        { $match: { type: 'commission_debit' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalCommissionsEarned = commissionSum[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalProviders,
        pendingVerifications,
        verifiedProviders,
        totalBookings,
        completedBookings,
        totalCommissionsEarnedNPR: totalCommissionsEarned,
      },
    });
  }

  /**
   * List providers awaiting identity verification
   */
  static async getPendingProviders(req: AuthRequest, res: Response): Promise<void> {
    const pendingProviders = await ProviderProfile.find({
      'documents.verificationStatus': 'pending',
    })
      .populate('userId', 'name phoneNumber email createdAt')
      .populate('categories', 'name')
      .populate('subCategories', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingProviders.length,
      data: pendingProviders,
    });
  }

  /**
   * Approve or reject a provider's verification documents
   */
  static async reviewProviderVerification(req: AuthRequest, res: Response): Promise<void> {
    const { providerId } = req.params;
    const { action, rejectionReason } = req.body; // 'approve' | 'reject'

    if (action !== 'approve' && action !== 'reject') {
      res.status(400).json({ success: false, message: "Action must be either 'approve' or 'reject'" });
      return;
    }

    const provider = await ProviderProfile.findById(providerId);
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found' });
      return;
    }

    if (action === 'approve') {
      provider.documents.verificationStatus = 'verified';
      provider.documents.verifiedAt = new Date();
      provider.documents.rejectionReason = undefined;
    } else {
      provider.documents.verificationStatus = 'rejected';
      provider.documents.rejectionReason = rejectionReason || 'Documents did not meet verification criteria.';
    }

    await provider.save();

    res.json({
      success: true,
      message: `Provider status updated to ${provider.documents.verificationStatus}`,
      provider,
    });
  }

  /**
   * List all platform bookings with pagination and filters
   */
  static async listAllBookings(req: AuthRequest, res: Response): Promise<void> {
    const { status, limit = 50, page = 1 } = req.query;
    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('customerId', 'name phoneNumber')
        .populate({
          path: 'providerId',
          populate: { path: 'userId', select: 'name phoneNumber' },
        })
        .populate('categoryId', 'name')
        .populate('subCategoryId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: bookings,
    });
  }
}
