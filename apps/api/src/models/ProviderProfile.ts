import mongoose, { Schema, Document, Types } from 'mongoose';
import {
  VerificationStatus,
  PricingModel,
  IGeoPoint,
  IAddress,
} from '@sewanexa/shared-types';

export interface IProviderProfileDocument extends Document {
  userId: Types.ObjectId;
  businessName?: string;
  bio: string;
  categories: Types.ObjectId[];
  subCategories: Types.ObjectId[];
  skills: string[];
  experienceYears: number;
  documents: {
    citizenshipFront?: string;
    citizenshipBack?: string;
    businessRegistration?: string;
    identityDocType: 'citizenship' | 'driving_license' | 'national_id' | 'business_pan';
    identityNumber?: string;
    verificationStatus: VerificationStatus;
    rejectionReason?: string;
    verifiedAt?: Date;
  };
  location: IGeoPoint;
  address: IAddress;
  serviceRadiusKm: number;
  isOnline: boolean;
  pricingModel: PricingModel;
  baseRate?: number;
  portfolioPhotos: string[];
  ratings: {
    average: number;
    count: number;
  };
  wallet: {
    currentBalance: number;
    escrowBalance: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const providerProfileSchema = new Schema<IProviderProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      default: '',
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    documents: {
      citizenshipFront: String,
      citizenshipBack: String,
      businessRegistration: String,
      identityDocType: {
        type: String,
        enum: ['citizenship', 'driving_license', 'national_id', 'business_pan'],
        default: 'citizenship',
      },
      identityNumber: String,
      verificationStatus: {
        type: String,
        enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
        default: 'pending',
        index: true,
      },
      rejectionReason: String,
      verifiedAt: Date,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      city: { type: String, required: true },
      areaName: { type: String, required: true },
      formattedAddress: { type: String, required: true },
      landmark: String,
    },
    serviceRadiusKm: {
      type: Number,
      default: 5,
    },
    isOnline: {
      type: Boolean,
      default: true,
      index: true,
    },
    pricingModel: {
      type: String,
      enum: ['fixed', 'hourly', 'quotation'],
      default: 'fixed',
    },
    baseRate: {
      type: Number,
      default: 0,
    },
    portfolioPhotos: {
      type: [String],
      default: [],
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    wallet: {
      currentBalance: { type: Number, default: 0 },
      escrowBalance: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Crucial 2dsphere index for location queries and compound filters
providerProfileSchema.index({
  location: '2dsphere',
  isOnline: 1,
  'documents.verificationStatus': 1,
});

export const ProviderProfile = mongoose.model<IProviderProfileDocument>(
  'ProviderProfile',
  providerProfileSchema
);

