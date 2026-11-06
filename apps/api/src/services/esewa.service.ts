import crypto from 'crypto';
import { config } from '../config/env.js';
import { IEsewaInitiateParams } from '@sewanexa/shared-types';

export class EsewaService {
  /**
   * Generates HMAC-SHA256 signature for eSewa v2 API
   */
  static generateSignature(message: string): string {
    const hmac = crypto.createHmac('sha256', config.esewa.secretKey);
    hmac.update(message);
    return hmac.digest('base64');
  }

  /**
   * Generates the form parameters and cryptographic signature for eSewa payment initiation
   */
  static getPaymentFormData({
    totalAmount,
    transactionUuid,
    successUrl,
    failureUrl,
  }: {
    totalAmount: number;
    transactionUuid: string;
    successUrl: string;
    failureUrl: string;
  }): IEsewaInitiateParams {
    const productCode = config.esewa.productCode;
    const signedFieldNames = 'total_amount,transaction_uuid,product_code';
    const messageToSign = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const signature = this.generateSignature(messageToSign);

    return {
      amount: totalAmount,
      tax_amount: 0,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: signedFieldNames,
      signature,
    };
  }

  /**
   * Decodes eSewa base64 encoded response payload
   */
  static decodeResponsePayload(encodedData: string): Record<string, any> | null {
    try {
      const decodedStr = Buffer.from(encodedData, 'base64').toString('utf-8');
      return JSON.parse(decodedStr);
    } catch (err) {
      console.error('[eSewa Service] Failed to decode response data:', err);
      return null;
    }
  }

  /**
   * Verifies the transaction with eSewa Status Check API
   */
  static async verifyTransactionStatus({
    productCode,
    totalAmount,
    transactionUuid,
  }: {
    productCode: string;
    totalAmount: number;
    transactionUuid: string;
  }): Promise<{ isSuccess: boolean; status: string; refId?: string }> {
    try {
      const url = `${config.esewa.statusCheckUrl}?product_code=${productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;
      const response = await fetch(url, { method: 'GET' });
      const data = await response.json();

      if (data && data.status === 'COMPLETE') {
        return {
          isSuccess: true,
          status: data.status,
          refId: data.ref_id,
        };
      }

      return {
        isSuccess: false,
        status: data?.status || 'FAILED',
      };
    } catch (err) {
      console.error('[eSewa Service] Transaction verification failed:', err);
      return { isSuccess: false, status: 'ERROR' };
    }
  }
}

