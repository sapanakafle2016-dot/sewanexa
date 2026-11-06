import { config } from '../config/env.js';
import { IKhaltiInitiatePayload } from '@sewanexa/shared-types';

export class KhaltiService {
  /**
   * Initiates payment with Khalti API v2
   */
  static async initiatePayment(payload: IKhaltiInitiatePayload): Promise<{
    pidx: string;
    payment_url: string;
    expires_at: string;
  }> {
    const url = `${config.khalti.gatewayUrl}/initiate/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Key ${config.khalti.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || 'Khalti payment initiation failed');
    }

    return data;
  }

  /**
   * Verifies payment status with Khalti Lookup API v2
   */
  static async lookupPayment(pidx: string): Promise<{
    pidx: string;
    status: 'Completed' | 'Pending' | 'Initiated' | 'Refunded' | 'Expired' | 'User canceled';
    transaction_id?: string;
    total_amount: number;
    fee: number;
  }> {
    const url = `${config.khalti.gatewayUrl}/lookup/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Key ${config.khalti.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Khalti payment verification failed');
    }

    return data;
  }
}
