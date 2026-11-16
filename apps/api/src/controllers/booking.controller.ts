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

    // When accepted, initialize provider live location from profile or default nearby position
    if (status === 'accepted' && !booking.providerLiveLocation?.coordinates?.length) {
      const initCoords = provider?.location?.coordinates || [85.3480, 27.6780];
      booking.providerLiveLocation = {
        type: 'Point',
        coordinates: initCoords as [number, number],
        heading: 0,
        updatedAt: new Date(),
      };
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

  /**
   * Get real-time location tracking for an active booking
   * Shows client location and live provider location with distance & ETA
   */
  static async getTracking(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('customerId', 'name phoneNumber avatarUrl')
      .populate({
        path: 'providerId',
        populate: { path: 'userId', select: 'name phoneNumber avatarUrl' },
      })
      .populate('subCategoryId', 'name slug icon');

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    // Default fallback coordinates if needed (Lokanthali / Koteshwor)
    const clientCoords: [number, number] = (booking.jobLocation?.coordinates as [number, number]) || [
      85.3587,
      27.671,
    ];

    const providerObj: any = booking.providerId;
    let providerCoords: [number, number] = (booking.providerLiveLocation?.coordinates as [
      number,
      number,
    ]) ||
      (providerObj?.location?.coordinates as [number, number]) || [85.348, 27.678];

    // Haversine calculation: lon1, lat1, lon2, lat2
    const R = 6371; // Earth's radius in km
    const dLat = ((clientCoords[1] - providerCoords[1]) * Math.PI) / 180;
    const dLon = ((clientCoords[0] - providerCoords[0]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((providerCoords[1] * Math.PI) / 180) *
        Math.cos((clientCoords[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c * 100) / 100;
    const etaMinutes = Math.max(1, Math.ceil((distanceKm / 20) * 60));

    res.json({
      success: true,
      tracking: {
        bookingId: booking._id,
        bookingCode: booking.bookingCode,
        status: booking.status,
        serviceName: (booking.subCategoryId as any)?.name || 'Local Service',
        client: {
          id: (booking.customerId as any)?._id,
          name: (booking.customerId as any)?.name || 'Client',
          phoneNumber: (booking.customerId as any)?.phoneNumber || '98XXXXXXXX',
          address: booking.address,
          coordinates: {
            longitude: clientCoords[0],
            latitude: clientCoords[1],
          },
        },
        provider: providerObj
          ? {
              id: providerObj._id,
              name: providerObj.userId?.name || providerObj.businessName || 'Service Provider',
              businessName: providerObj.businessName,
              phoneNumber: providerObj.userId?.phoneNumber || '98XXXXXXXX',
              rating: providerObj.ratings?.average || 4.9,
              totalJobs: providerObj.ratings?.count || 24,
              coordinates: {
                longitude: providerCoords[0],
                latitude: providerCoords[1],
              },
              heading: booking.providerLiveLocation?.heading || 0,
              lastUpdated: booking.providerLiveLocation?.updatedAt || new Date(),
            }
          : null,
        telemetry: {
          distanceKm,
          etaMinutes,
          speedKmh: booking.status === 'en_route' ? 24 : 0,
        },
        timeline: booking.timeline,
      },
    });
  }

  /**
   * Update live location of provider for a booking (called by mobile app GPS)
   */
  static async updateProviderLocation(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { longitude, latitude, heading = 0 } = req.body;

    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      res.status(400).json({ success: false, message: 'Valid longitude and latitude are required' });
      return;
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    booking.providerLiveLocation = {
      type: 'Point',
      coordinates: [longitude, latitude],
      heading,
      updatedAt: new Date(),
    };

    await booking.save();

    // Calculate distance & ETA
    const clientCoords = booking.jobLocation.coordinates;
    const R = 6371;
    const dLat = ((clientCoords[1] - latitude) * Math.PI) / 180;
    const dLon = ((clientCoords[0] - longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((latitude * Math.PI) / 180) *
        Math.cos((clientCoords[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c * 100) / 100;
    const etaMinutes = Math.max(1, Math.ceil((distanceKm / 20) * 60));

    // Broadcast live event via Socket.IO
    try {
      const io = getSocketIO();
      if (io) {
        io.to(`booking:${booking._id}`).emit(SocketEvents.PROVIDER_LOCATION_UPDATE, {
          bookingId: booking._id,
          longitude,
          latitude,
          heading,
          distanceKm,
          etaMinutes,
          updatedAt: new Date(),
        });
      }
    } catch (err) {
      // non-blocking socket
    }

    res.json({
      success: true,
      message: 'Provider location updated',
      telemetry: {
        distanceKm,
        etaMinutes,
        coordinates: [longitude, latitude],
      },
    });
  }
}

