import { Response } from 'express';
import { createBookingSchema, createReviewSchema } from '@sewanexa/validation';
import { Booking } from '../models/Booking.js';
import { ProviderProfile } from '../models/ProviderProfile.js';
import { Review } from '../models/Review.js';
import { AuthRequest } from '../middlewares/auth.js';
import { getSocketIO } from '../sockets/socketHandler.js';
import { SocketEvents } from '@sewanexa/shared-types';

export class BookingController {
  /**
   * Create a new service booking request (direct or broadcast)
   */
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const validated = createBookingSchema.parse(req.body);

    // Generate unique booking code: SWX-YYYY-XXXXX
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `SWX-${new Date().getFullYear()}-${randomCode}`;

    let totalAmount = validated.estimatedAmount || 0;
    // If direct booking, find provider base rate if available
    if (validated.providerId) {
      const provider = await ProviderProfile.findById(validated.providerId);
      if (provider && provider.baseRate && !totalAmount) {
        totalAmount = provider.baseRate;
      }
    }

    const booking = await Booking.create({
      bookingCode,
      customerId: req.user._id,
      providerId: validated.providerId,
      categoryId: validated.categoryId,
      subCategoryId: validated.subCategoryId,
      bookingType: validated.bookingType,
      status: 'requested',
      jobLocation: validated.jobLocation,
      address: validated.address,
      scheduledTime: new Date(validated.scheduledTime),
      description: validated.description,
      problemPhotos: validated.problemPhotos,
      payment: {
        method: validated.paymentMethod,
        status: 'pending',
        totalAmount,
        platformCommission: Math.round(totalAmount * 0.1),
        providerAmount: Math.round(totalAmount * 0.9),
      },
      timeline: [
        {
          status: 'requested',
          timestamp: new Date(),
          note: 'Booking request placed by customer',
          updatedBy: req.user._id,
        },
      ],
    });

    // Real-time dispatch via Socket.IO
    try {
      const io = getSocketIO();
      if (io) {
        if (validated.providerId) {
          // Send to specific provider room
          io.to(`provider:${validated.providerId}`).emit(SocketEvents.NEW_JOB_BROADCAST, {
            bookingId: booking._id,
            bookingCode: booking.bookingCode,
            customerName: req.user.name,
            address: booking.address,
            description: booking.description,
          });
        } else {
          // Broadcast to nearby providers
          io.emit(SocketEvents.NEW_JOB_BROADCAST, {
            bookingId: booking._id,
            bookingCode: booking.bookingCode,
            customerName: req.user.name,
            address: booking.address,
            description: booking.description,
            jobLocation: booking.jobLocation,
          });
        }
      }
    } catch (err) {
      console.warn('[Socket Dispatch] Notification dispatch skipped:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      booking,
    });
  }

  /**
   * Get all bookings for current user (customer or provider)
   */
  static async getMyBookings(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { role = 'customer', status } = req.query;
    const filter: Record<string, any> = {};

    if (role === 'provider') {
      const provider = await ProviderProfile.findOne({ userId: req.user._id });
      if (!provider) {
        res.status(403).json({ success: false, message: 'Provider profile not found' });
        return;
      }
      filter.providerId = provider._id;
    } else {
      filter.customerId = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('customerId', 'name phoneNumber avatarUrl')
      .populate({
        path: 'providerId',
        populate: { path: 'userId', select: 'name phoneNumber avatarUrl' },
      })
      .populate('categoryId', 'name slug icon')
      .populate('subCategoryId', 'name slug icon')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  }

  /**
   * Update booking status (accept, reject, en_route, in_progress, completed, cancel)
   */
  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { status, note, totalAmount } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    // Role checks
    const provider = await ProviderProfile.findOne({ userId: req.user._id });
    const isCustomer = booking.customerId.toString() === req.user._id.toString();
    const isAssignedProvider = provider && booking.providerId?.toString() === provider._id.toString();

    // If accepting a broadcast booking, assign the provider
    if (status === 'accepted' && !booking.providerId && provider) {
      booking.providerId = provider._id;
    }

    booking.status = status;
    if (totalAmount && typeof totalAmount === 'number') {
      booking.payment.totalAmount = totalAmount;
      booking.payment.platformCommission = Math.round(totalAmount * 0.1);
      booking.payment.providerAmount = Math.round(totalAmount * 0.9);
    }

    booking.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Booking status updated to ${status}`,
      updatedBy: req.user._id,
    });

    await booking.save();

    // Notify counterpart via Socket.IO
    try {
      const io = getSocketIO();
      if (io) {
        io.to(`booking:${booking._id}`).emit(SocketEvents.JOB_STATUS_CHANGE, {
          bookingId: booking._id,
          status,
          note,
        });
      }
    } catch (err) {
      // socket non-blocking
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking,
    });
  }

  /**
   * Submit a review for a completed service
   */
  static async addReview(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const validated = createReviewSchema.parse(req.body);

    const booking = await Booking.findById(validated.bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'You can only review bookings made by yourself' });
      return;
    }

    if (booking.status !== 'completed') {
      res.status(400).json({ success: false, message: 'You can only review completed jobs' });
      return;
    }

    if (!booking.providerId) {
      res.status(400).json({ success: false, message: 'No provider assigned to this booking' });
      return;
    }

    // Check if review already exists
    const existing = await Review.findOne({ bookingId: booking._id });
    if (existing) {
      res.status(400).json({ success: false, message: 'You have already reviewed this service' });
      return;
    }

    const review = await Review.create({
      bookingId: booking._id,
      customerId: req.user._id,
      providerId: booking.providerId,
      rating: validated.rating,
      comment: validated.comment,
      photos: validated.photos || [],
    });

    // Update provider ratings stats
    const allReviews = await Review.find({ providerId: booking.providerId });
    const totalCount = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount;

    await ProviderProfile.findByIdAndUpdate(booking.providerId, {
      'ratings.average': Math.round(avgRating * 10) / 10,
      'ratings.count': totalCount,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your rating and review!',
      review,
    });
  }
}

