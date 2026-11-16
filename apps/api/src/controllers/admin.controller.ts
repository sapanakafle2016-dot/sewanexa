import { Response } from 'express';
import { User } from '../models/User.js';
import { ProviderProfile } from '../models/ProviderProfile.js';
import { Booking } from '../models/Booking.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { Category } from '../models/Category.js';
import { SubCategory } from '../models/SubCategory.js';
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

  /**
   * ─── DYNAMIC SERVICES & CATEGORIES MANAGEMENT ──────────────────────────────
   */

  /**
   * List all categories (active & inactive) with their services/subcategories
   */
  static async listAllCategoriesAdmin(req: AuthRequest, res: Response): Promise<void> {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });

    const fullCategories = await Promise.all(
      categories.map(async (cat) => {
        const subcategories = await SubCategory.find({ categoryId: cat._id }).sort({
          order: 1,
          createdAt: -1,
        });

        const activeProvidersCount = await ProviderProfile.countDocuments({
          categories: cat._id,
        });

        return {
          ...cat.toObject(),
          subcategories,
          activeProvidersCount,
        };
      })
    );

    res.json({
      success: true,
      count: fullCategories.length,
      data: fullCategories,
    });
  }

  /**
   * Create a new service category
   */
  static async createCategory(req: AuthRequest, res: Response): Promise<void> {
    const { name, slug, icon, description, commissionPercentage, order, isActive } = req.body;

    if (!name || typeof name !== 'string') {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const finalSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({
      $or: [{ name: name.trim() }, { slug: finalSlug }],
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists',
      });
      return;
    }

    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      icon: icon || 'wrench',
      description: description || '',
      commissionPercentage: typeof commissionPercentage === 'number' ? commissionPercentage : 10,
      order: typeof order === 'number' ? order : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  }

  /**
   * Update category
   */
  static async updateCategory(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, slug, icon, description, commissionPercentage, order, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    if (name) category.name = name.trim();
    if (slug) {
      category.slug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (icon !== undefined) category.icon = icon;
    if (description !== undefined) category.description = description;
    if (commissionPercentage !== undefined) category.commissionPercentage = Number(commissionPercentage);
    if (order !== undefined) category.order = Number(order);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  }

  /**
   * Delete or toggle category
   */
  static async deleteCategory(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    // Soft delete by deactivating
    category.isActive = false;
    await category.save();

    // Also deactivate related subcategories
    await SubCategory.updateMany({ categoryId: category._id }, { isActive: false });

    res.json({
      success: true,
      message: 'Category and its sub-services deactivated successfully',
    });
  }

  /**
   * Create a new subcategory (specific service / trade)
   */
  static async createSubCategory(req: AuthRequest, res: Response): Promise<void> {
    const {
      categoryId,
      name,
      slug,
      icon,
      description,
      suggestedBasePrice,
      order,
      isActive,
    } = req.body;

    if (!categoryId || !name) {
      res.status(400).json({ success: false, message: 'categoryId and service name are required' });
      return;
    }

    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      res.status(404).json({ success: false, message: 'Parent Category not found' });
      return;
    }

    const finalSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await SubCategory.findOne({ categoryId, slug: finalSlug });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'A service with this name already exists in this category',
      });
      return;
    }

    const subCategory = await SubCategory.create({
      categoryId: parentCategory._id,
      name: name.trim(),
      slug: finalSlug,
      icon: icon || parentCategory.icon,
      description: description || '',
      suggestedBasePrice: typeof suggestedBasePrice === 'number' ? suggestedBasePrice : 500,
      order: typeof order === 'number' ? order : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: 'New service created successfully',
      data: subCategory,
    });
  }

  /**
   * Update subcategory / service
   */
  static async updateSubCategory(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, slug, icon, description, suggestedBasePrice, order, isActive, categoryId } = req.body;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    if (name) subCategory.name = name.trim();
    if (slug) {
      subCategory.slug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (categoryId) subCategory.categoryId = categoryId;
    if (icon !== undefined) subCategory.icon = icon;
    if (description !== undefined) subCategory.description = description;
    if (suggestedBasePrice !== undefined) subCategory.suggestedBasePrice = Number(suggestedBasePrice);
    if (order !== undefined) subCategory.order = Number(order);
    if (isActive !== undefined) subCategory.isActive = Boolean(isActive);

    await subCategory.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: subCategory,
    });
  }

  /**
   * Delete or deactivate subcategory / service
   */
  static async deleteSubCategory(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    subCategory.isActive = false;
    await subCategory.save();

    res.json({
      success: true,
      message: 'Service deactivated successfully',
    });
  }

  /**
   * ─── PROVIDERS GOVERNANCE & MANAGEMENT ─────────────────────────────────────
   */

  /**
   * List all providers with filter, search, and pagination
   */
  static async getAllProviders(req: AuthRequest, res: Response): Promise<void> {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter['documents.verificationStatus'] = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    let query = ProviderProfile.find(filter)
      .populate('userId', 'name phoneNumber email status createdAt')
      .populate('categories', 'name')
      .populate('subCategories', 'name')
      .sort({ createdAt: -1 });

    const [providers, total] = await Promise.all([
      query.skip(skip).limit(Number(limit)),
      ProviderProfile.countDocuments(filter),
    ]);

    // Optional text filter if search provided
    let results = providers;
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = providers.filter((p: any) => {
        const u = p.userId;
        const nameMatch = u?.name?.toLowerCase().includes(q);
        const phoneMatch = u?.phoneNumber?.includes(q);
        const businessMatch = p.businessName?.toLowerCase().includes(q);
        const skillMatch = p.skills?.some((s: string) => s.toLowerCase().includes(q));
        return nameMatch || phoneMatch || businessMatch || skillMatch;
      });
    }

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: results,
    });
  }

  /**
   * Update provider status (verification or account suspension)
   */
  static async updateProviderStatus(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { verificationStatus, userStatus, rejectionReason } = req.body;

    const provider = await ProviderProfile.findById(id).populate('userId');
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider not found' });
      return;
    }

    if (verificationStatus) {
      provider.documents.verificationStatus = verificationStatus;
      if (verificationStatus === 'verified') {
        provider.documents.verifiedAt = new Date();
        provider.documents.rejectionReason = undefined;
      } else if (verificationStatus === 'rejected') {
        provider.documents.rejectionReason = rejectionReason || 'Verification rejected by administrator';
      }
      await provider.save();
    }

    if (userStatus && provider.userId) {
      await User.findByIdAndUpdate(provider.userId._id, { status: userStatus });
    }

    res.json({
      success: true,
      message: 'Provider status updated successfully',
      data: provider,
    });
  }

  /**
   * ─── USER & CUSTOMER MANAGEMENT ────────────────────────────────────────────
   */

  /**
   * List all platform users with roles, booking count, and filter
   */
  static async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (role && role !== 'all') {
      filter.role = role;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search && typeof search === 'string') {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { phoneNumber: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    // Attach booking stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const bookingsCount = await Booking.countDocuments({
          $or: [{ customerId: u._id }, { 'providerId.userId': u._id }],
        });
        return {
          ...u.toObject(),
          bookingsCount,
        };
      })
    );

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: usersWithStats,
    });
  }

  /**
   * Toggle user account status (active, suspended)
   */
  static async updateUserStatus(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { status, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (status) user.status = status;
    if (role) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: `User status updated to ${user.status}`,
      data: user,
    });
  }

  /**
   * ─── FINANCIALS, COMMISSIONS & PAYOUTS ──────────────────────────────────────
   */

  /**
   * Get financial summary, GMV, and wallet transactions
   */
  static async getFinancialOverview(req: AuthRequest, res: Response): Promise<void> {
    const [
      gmvResult,
      commissionResult,
      escrowResult,
      transactions,
      providersWithWallet,
    ] = await Promise.all([
      Booking.aggregate([
        { $match: { 'payment.paymentStatus': 'paid' } },
        { $group: { _id: null, totalGMV: { $sum: '$finalTotalAmount' } } },
      ]),
      WalletTransaction.aggregate([
        { $match: { type: 'commission_debit' } },
        { $group: { _id: null, totalCommission: { $sum: '$amount' } } },
      ]),
      Booking.aggregate([
        { $match: { 'payment.paymentStatus': 'escrow_held' } },
        { $group: { _id: null, totalEscrow: { $sum: '$finalTotalAmount' } } },
      ]),
      WalletTransaction.find()
        .populate({
          path: 'providerId',
          populate: { path: 'userId', select: 'name phoneNumber' },
        })
        .sort({ createdAt: -1 })
        .limit(30),
      ProviderProfile.find({ 'wallet.currentBalance': { $gt: 0 } })
        .populate('userId', 'name phoneNumber')
        .sort({ 'wallet.currentBalance': -1 })
        .limit(20),
    ]);

    res.json({
      success: true,
      summary: {
        totalGMVNPR: gmvResult[0]?.totalGMV || 0,
        totalCommissionNPR: commissionResult[0]?.totalCommission || 0,
        totalEscrowHeldNPR: escrowResult[0]?.totalEscrow || 0,
      },
      recentTransactions: transactions,
      topProviderBalances: providersWithWallet,
    });
  }
}


