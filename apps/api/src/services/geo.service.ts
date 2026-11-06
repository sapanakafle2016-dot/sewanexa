import mongoose from 'mongoose';
import { ProviderProfile } from '../models/ProviderProfile.js';
import { INearbySearchQuery } from '@sewanexa/shared-types';

export class GeoService {
  /**
   * Performs geospatial search for available verified providers within a radius (km)
   */
  static async searchNearbyProviders(query: INearbySearchQuery) {
    const {
      longitude,
      latitude,
      radiusKm = 5,
      categoryId,
      subCategoryId,
      searchQuery,
      minRating,
      maxPrice,
      sortBy = 'distance',
    } = query;

    const matchConditions: Record<string, any> = {
      isOnline: true,
      'documents.verificationStatus': 'verified',
    };

    if (categoryId) {
      matchConditions.categories = new mongoose.Types.ObjectId(categoryId);
    }

    if (subCategoryId) {
      matchConditions.subCategories = new mongoose.Types.ObjectId(subCategoryId);
    }

    if (minRating) {
      matchConditions['ratings.average'] = { $gte: Number(minRating) };
    }

    if (maxPrice) {
      matchConditions.baseRate = { $lte: Number(maxPrice) };
    }

    if (searchQuery) {
      matchConditions.$or = [
        { bio: { $regex: searchQuery, $options: 'i' } },
        { skills: { $in: [new RegExp(searchQuery, 'i')] } },
        { businessName: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Determine sort stage
    let sortStage: Record<string, 1 | -1> = { distanceInMeters: 1 };
    if (sortBy === 'rating') {
      sortStage = { 'ratings.average': -1, distanceInMeters: 1 };
    } else if (sortBy === 'price') {
      sortStage = { baseRate: 1, distanceInMeters: 1 };
    }

    const maxDistanceInMeters = radiusKm * 1000;

    const pipeline: mongoose.PipelineStage[] = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distanceInMeters',
          maxDistance: maxDistanceInMeters,
          spherical: true,
          query: matchConditions,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          userId: '$user._id',
          name: '$user.name',
          phoneNumber: '$user.phoneNumber',
          avatarUrl: '$user.avatarUrl',
          businessName: 1,
          bio: 1,
          skills: 1,
          experienceYears: 1,
          distanceInMeters: 1,
          distanceInKm: { $round: [{ $divide: ['$distanceInMeters', 1000] }, 2] },
          location: 1,
          address: 1,
          isOnline: 1,
          pricingModel: 1,
          baseRate: 1,
          ratings: 1,
          portfolioPhotos: 1,
        },
      },
      { $sort: sortStage },
    ];

    return await ProviderProfile.aggregate(pipeline);
  }
}
