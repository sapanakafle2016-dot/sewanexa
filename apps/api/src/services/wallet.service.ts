import mongoose from 'mongoose';
import { ProviderProfile } from '../models/ProviderProfile.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { config } from '../config/env.js';
import { PaymentMethod } from '@sewanexa/shared-types';

export class WalletService {
  /**
   * Processes platform commission deduction upon booking completion
   */
  static async processBookingCommission({
    providerId,
    bookingId,
    totalAmount,
    paymentMethod,
    customCommissionPercent,
  }: {
    providerId: string | mongoose.Types.ObjectId;
    bookingId: string | mongoose.Types.ObjectId;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    customCommissionPercent?: number;
  }) {
    const commissionPercent = customCommissionPercent ?? config.commissionPercentage;
    const platformCommission = Math.round((totalAmount * commissionPercent) / 100);
    const providerEarning = totalAmount - platformCommission;

    const provider = await ProviderProfile.findById(providerId);
    if (!provider) throw new Error('Provider not found');

    const balanceBefore = provider.wallet.currentBalance;
    let balanceAfter: number;

    if (paymentMethod === 'cash') {
      // In Cash payment, provider received 100% in hand; debit commission from their wallet balance
      balanceAfter = balanceBefore - platformCommission;
      provider.wallet.currentBalance = balanceAfter;
      await provider.save();

      await WalletTransaction.create({
        providerId,
        bookingId,
        type: 'commission_debit',
        amount: platformCommission,
        balanceBefore,
        balanceAfter,
        paymentMethod: 'cash',
        notes: `Platform commission (${commissionPercent}%) for booking completed in cash`,
      });
    } else {
      // For digital payment (eSewa / Khalti), platform collected 100%; credit net amount to provider wallet
      balanceAfter = balanceBefore + providerEarning;
      provider.wallet.currentBalance = balanceAfter;
      await provider.save();

      await WalletTransaction.create({
        providerId,
        bookingId,
        type: 'deposit',
        amount: providerEarning,
        balanceBefore,
        balanceAfter,
        paymentMethod,
        notes: `Net earnings credited after ${commissionPercent}% commission`,
      });
    }

    return {
      platformCommission,
      providerEarning,
      balanceAfter,
    };
  }

  /**
   * Checks if provider is in good financial standing (wallet above negative debt limit)
   */
  static async checkProviderStatus(providerId: string | mongoose.Types.ObjectId): Promise<{
    canAcceptJobs: boolean;
    currentBalance: number;
    duesLimit: number;
  }> {
    const provider = await ProviderProfile.findById(providerId);
    if (!provider) return { canAcceptJobs: false, currentBalance: 0, duesLimit: 2000 };

    const duesLimit = 2000; // NPR 2,000 threshold for cash commissions
    const canAcceptJobs = provider.wallet.currentBalance >= -duesLimit;

    return {
      canAcceptJobs,
      currentBalance: provider.wallet.currentBalance,
      duesLimit,
    };
  }
}

