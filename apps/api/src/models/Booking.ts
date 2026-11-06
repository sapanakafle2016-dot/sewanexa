import mongoose, { Schema, Document, Types } from 'mongoose';
import {
  BookingStatus,
  BookingType,
  PaymentMethod,
  PaymentStatus,
  IGeoPoint,
  IAddress,
} from '@sewanexa/shared-types';

export interface IBookingDocument extends Document {
  bookingCode: string;
  customerId: Types.ObjectId;
  providerId?: Types.ObjectId;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  bookingType: BookingType;
  status: BookingStatus;
  jobLocation: IGeoPoint;
  address: IAddress;
  scheduledTime: Date;
  description: string;
  problemPhotos: string[];
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    totalAmount: number;
    platformCommission: number;
    providerAmount: number;
    transactionId?: string;
    paidAt?: Date;
  };
  timeline: Array<{
    status: BookingStatus;
    timestamp: Date;
    note?: string;
    updatedBy?: Types.ObjectId;
  }>;
  cancellationReason?: string;
  cancelledBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBookingDocument>(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'ProviderProfile',
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    bookingType: {
      type: String,
      enum: ['direct', 'broadcast'],
      default: 'direct',
    },
    status: {
      type: String,
      enum: [
        'requested',
        'accepted',
        'rejected',
        'en_route',
        'in_progress',
        'completed',
        'cancelled',
      ],
      default: 'requested',
      index: true,
    },
    jobLocation: {
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
    scheduledTime: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    problemPhotos: {
      type: [String],
      default: [],
    },
    payment: {
      method: {
        type: String,
        enum: ['cash', 'esewa', 'khalti'],
        default: 'cash',
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      totalAmount: {
        type: Number,
        default: 0,
      },
      platformCommission: {
        type: Number,
        default: 0,
      },
      providerAmount: {
        type: Number,
        default: 0,
      },
      transactionId: String,
      paidAt: Date,
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: String,
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    cancellationReason: String,
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ jobLocation: '2dsphere' });

export const Booking = mongoose.model<IBookingDocument>('Booking', bookingSchema);

