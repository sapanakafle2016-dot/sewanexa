import mongoose, { Schema, Document, Types } from 'mongoose';
import { PaymentMethod } from '@sewanexa/shared-types';

export interface IWalletTransactionDocument extends Document {
  providerId: Types.ObjectId;
  bookingId?: Types.ObjectId;
  type: 'commission_debit' | 'payout' | 'deposit' | 'referral_bonus';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: Date;
}

const walletTransactionSchema = new Schema<IWalletTransactionDocument>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'ProviderProfile',
      required: true,
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      index: true,
    },
    type: {
      type: String,
      enum: ['commission_debit', 'payout', 'deposit', 'referral_bonus'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    referenceId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'esewa', 'khalti'],
    },
    notes: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const WalletTransaction = mongoose.model<IWalletTransactionDocument>(
  'WalletTransaction',
  walletTransactionSchema
);

