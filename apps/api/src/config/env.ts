import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sewanexa',
  jwt: {
    secret: process.env.JWT_SECRET || 'sewanexa_jwt_secret_dev_local_nepal_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  },
  esewa: {
    productCode: process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST',
    secretKey: process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
    gatewayUrl: process.env.ESEWA_GATEWAY_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    statusCheckUrl: process.env.ESEWA_STATUS_CHECK_URL || 'https://uat.esewa.com.np/api/epay/transaction/status/',
  },
  khalti: {
    publicKey: process.env.KHALTI_PUBLIC_KEY || 'test_public_key_dc74e0fd57cb46cd93832aee0a505e0c',
    secretKey: process.env.KHALTI_SECRET_KEY || 'test_secret_key_f59e8b7d18b4499be40251c1c3977824',
    gatewayUrl: process.env.KHALTI_GATEWAY_URL || 'https://a.khalti.com/api/v2/epayment',
  },
  commissionPercentage: parseFloat(process.env.DEFAULT_COMMISSION_PERCENTAGE || '10'),
  sms: {
    provider: process.env.SMS_GATEWAY_PROVIDER || 'mock',
    sparrowToken: process.env.SPARROW_SMS_TOKEN || '',
    sparrowFrom: process.env.SPARROW_SMS_FROM || 'Sewanexa',
  },
};
