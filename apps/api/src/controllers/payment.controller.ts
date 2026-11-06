import { Response } from 'express';
import { esewaInitiateSchema, khaltiInitiateSchema } from '@sewanexa/validation';
import { Booking } from '../models/Booking.js';
import { EsewaService } from '../services/esewa.service.js';
import { KhaltiService } from '../services/khalti.service.js';
import { WalletService } from '../services/wallet.service.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middlewares/auth.js';

export class PaymentController {
  /**
   * Initiate eSewa Payment
   */
  static async initiateEsewa(req: AuthRequest, res: Response): Promise<void> {
    const validated = esewaInitiateSchema.parse(req.body);
    const booking = await Booking.findById(validated.bookingId);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const transactionUuid = `${booking.bookingCode}-${Date.now()}`;
    const successUrl = `${config.clientUrl}/payment/esewa/success`;
    const failureUrl = `${config.clientUrl}/payment/esewa/failure`;

    const paymentParams = EsewaService.getPaymentFormData({
      totalAmount: validated.amount,
      transactionUuid,
      successUrl,
      failureUrl,
    });

    res.json({
      success: true,
      gatewayUrl: config.esewa.gatewayUrl,
      paymentParams,
    });
  }

  /**
   * Verify eSewa payment response
   */
  static async verifyEsewa(req: AuthRequest, res: Response): Promise<void> {
    const { encodedData, bookingId } = req.body;

    if (!encodedData || !bookingId) {
      res.status(400).json({ success: false, message: 'Encoded response data and bookingId required' });
      return;
    }

    const decoded = EsewaService.decodeResponsePayload(encodedData);
    if (!decoded) {
      res.status(400).json({ success: false, message: 'Invalid payment response signature' });
      return;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    // Verify with eSewa transaction status API
    const verification = await EsewaService.verifyTransactionStatus({
      productCode: config.esewa.productCode,
      totalAmount: booking.payment.totalAmount,
      transactionUuid: decoded.transaction_uuid,
    });

    if (!verification.isSuccess && config.nodeEnv === 'production') {
      res.status(400).json({ success: false, message: 'Payment verification failed with eSewa' });
      return;
    }

    // Mark booking payment complete
    booking.payment.status = 'completed';
    booking.payment.method = 'esewa';
    booking.payment.transactionId = decoded.transaction_code || verification.refId || decoded.transaction_uuid;
    booking.payment.paidAt = new Date();
    await booking.save();

    // Process provider wallet deposit & commission
    if (booking.providerId) {
      await WalletService.processBookingCommission({
        providerId: booking.providerId,
        bookingId: booking._id,
        totalAmount: booking.payment.totalAmount,
        paymentMethod: 'esewa',
      });
    }

    res.json({
      success: true,
      message: 'eSewa payment verified successfully',
      booking,
    });
  }

  /**
   * Initiate Khalti Payment (v2)
   */
  static async initiateKhalti(req: AuthRequest, res: Response): Promise<void> {
    const validated = khaltiInitiateSchema.parse(req.body);
    const booking = await Booking.findById(validated.bookingId).populate('customerId', 'name phoneNumber email');

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const customerUser: any = booking.customerId;
    const amountInPaisa = Math.round(validated.amount * 100);

    const khaltiPayload = {
      return_url: `${config.clientUrl}/payment/khalti/callback?bookingId=${booking._id}`,
      website_url: config.clientUrl,
      amount: amountInPaisa,
      purchase_order_id: booking.bookingCode,
      purchase_order_name: `Sewanexa Service: ${booking.bookingCode}`,
      customer_info: {
        name: customerUser?.name || 'Customer',
        phone: customerUser?.phoneNumber || '',
        email: customerUser?.email || '',
      },
    };

    const response = await KhaltiService.initiatePayment(khaltiPayload);

    res.json({
      success: true,
      pidx: response.pidx,
      paymentUrl: response.payment_url,
    });
  }

  /**
   * Verify Khalti payment (lookup API)
   */
  static async verifyKhalti(req: AuthRequest, res: Response): Promise<void> {
    const { pidx, bookingId } = req.body;

    if (!pidx || !bookingId) {
      res.status(400).json({ success: false, message: 'pidx and bookingId are required' });
      return;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const result = await KhaltiService.lookupPayment(pidx);

    if (result.status !== 'Completed') {
      res.status(400).json({ success: false, message: `Khalti payment is ${result.status}` });
      return;
    }

    booking.payment.status = 'completed';
    booking.payment.method = 'khalti';
    booking.payment.transactionId = result.transaction_id || pidx;
    booking.payment.paidAt = new Date();
    await booking.save();

    if (booking.providerId) {
      await WalletService.processBookingCommission({
        providerId: booking.providerId,
        bookingId: booking._id,
        totalAmount: booking.payment.totalAmount,
        paymentMethod: 'khalti',
      });
    }

    res.json({
      success: true,
      message: 'Khalti payment verified successfully',
      booking,
    });
  }

  /**
   * Confirm Cash payment on job completion
   */
  static async confirmCashPayment(req: AuthRequest, res: Response): Promise<void> {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    booking.payment.method = 'cash';
    booking.payment.status = 'completed';
    booking.payment.paidAt = new Date();
    await booking.save();

    // Commission is debited from provider's wallet balance
    if (booking.providerId) {
      await WalletService.processBookingCommission({
        providerId: booking.providerId,
        bookingId: booking._id,
        totalAmount: booking.payment.totalAmount,
        paymentMethod: 'cash',
      });
    }

    res.json({
      success: true,
      message: 'Cash payment confirmed and commission logged',
      booking,
    });
  }
}

