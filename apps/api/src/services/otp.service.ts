import { config } from '../config/env.js';

interface IOtpCache {
  otp: string;
  expiresAt: number;
}

// In-memory OTP storage for development/demo (in production, use Redis)
const otpStore = new Map<string, IOtpCache>();

export class OtpService {
  /**
   * Generates a 6-digit random OTP and stores it with a 5-minute expiry
   */
  static generateOtp(phoneNumber: string): string {
    // Standard test number convenience for development
    if (phoneNumber === '9800000000' || phoneNumber === '9841000000') {
      const devOtp = '123456';
      otpStore.set(phoneNumber, {
        otp: devOtp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });
      console.log(`[OTP Service] Dev bypass OTP for ${phoneNumber}: ${devOtp}`);
      return devOtp;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(phoneNumber, { otp, expiresAt });
    return otp;
  }

  /**
   * Sends the OTP via Sparrow SMS (Nepal) or logs to console in mock mode
   */
  static async sendOtp(phoneNumber: string, otp: string): Promise<boolean> {
    const message = `Your SEWANEXA verification code is: ${otp}. Do not share this code with anyone.`;

    if (config.sms.provider === 'sparrow' && config.sms.sparrowToken) {
      try {
        const response = await fetch('http://api.sparrowsms.com/v2/sms/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: config.sms.sparrowToken,
            from: config.sms.sparrowFrom,
            to: phoneNumber,
            text: message,
          }),
        });
        const data = await response.json();
        console.log(`[Sparrow SMS] Response for ${phoneNumber}:`, data);
        return response.ok;
      } catch (err) {
        console.error('[Sparrow SMS] Error sending SMS:', err);
        return false;
      }
    }

    // Default development / mock mode:
    console.log(`\n========================================`);
    console.log(`[MOCK SMS] Nepal Mobile: ${phoneNumber}`);
    console.log(`[MOCK SMS] Message: ${message}`);
    console.log(`========================================\n`);
    return true;
  }

  /**
   * Verifies the provided OTP against the stored entry
   */
  static verifyOtp(phoneNumber: string, submittedOtp: string): boolean {
    const cached = otpStore.get(phoneNumber);
    if (!cached) return false;

    if (Date.now() > cached.expiresAt) {
      otpStore.delete(phoneNumber);
      return false;
    }

    if (cached.otp === submittedOtp) {
      otpStore.delete(phoneNumber);
      return true;
    }

    return false;
  }
}
