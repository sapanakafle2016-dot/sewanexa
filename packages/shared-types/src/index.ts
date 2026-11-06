/**
 * SEWANEXA - Shared Types & Interfaces
 * Used across Backend API, Web App, and Mobile App
 */

export type UserRole = 'customer' | 'provider' | 'admin' | 'superadmin';

export type UserStatus = 'active' | 'suspended' | 'pending_verification';

export type VerificationStatus = 'unsubmitted' | 'pending' | 'verified' | 'rejected';

export type PricingModel = 'fixed' | 'hourly' | 'quotation';

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'rejected'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type BookingType = 'direct' | 'broadcast';

export type PaymentMethod = 'cash' | 'esewa' | 'khalti';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface IGeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IAddress {
  city: string;
  areaName: string;
  formattedAddress: string;
  landmark?: string;
}

export interface IUser {
  _id: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  deviceTokens?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IProviderDocuments {
  citizenshipFront?: string;
  citizenshipBack?: string;
  businessRegistration?: string;
  identityDocType: 'citizenship' | 'driving_license' | 'national_id' | 'business_pan';
  identityNumber?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
}

export interface IProviderProfile {
  _id: string;
  userId: string | IUser;
  businessName?: string;
  bio: string;
  categories: string[] | ICategory[];
  subCategories: string[] | ISubCategory[];
  skills: string[];
  experienceYears: number;
  documents: IProviderDocuments;
  location: IGeoPoint;
  address: IAddress;
  serviceRadiusKm: number;
  isOnline: boolean;
  pricingModel: PricingModel;
  baseRate?: number; // NPR
  portfolioPhotos: string[];
  ratings: {
    average: number;
    count: number;
  };
  wallet: {
    currentBalance: number; // In NPR
    escrowBalance: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  commissionPercentage: number; // e.g. 10
  isActive: boolean;
  order: number;
  subcategories?: ISubCategory[];
}

export interface ISubCategory {
  _id: string;
  categoryId: string | ICategory;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  suggestedBasePrice?: number;
  isActive: boolean;
  order: number;
}

export interface IBookingTimelineEvent {
  status: BookingStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface IBookingPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  totalAmount: number;
  platformCommission: number;
  providerAmount: number;
  transactionId?: string;
  paidAt?: string;
}

export interface IBooking {
  _id: string;
  bookingCode: string;
  customerId: string | IUser;
  providerId?: string | (IProviderProfile & { user?: IUser });
  categoryId: string | ICategory;
  subCategoryId: string | ISubCategory;
  bookingType: BookingType;
  status: BookingStatus;
  jobLocation: IGeoPoint;
  address: IAddress;
  scheduledTime: string;
  description: string;
  problemPhotos: string[];
  payment: IBookingPayment;
  timeline: IBookingTimelineEvent[];
  cancellationReason?: string;
  cancelledBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  bookingId: string;
  customerId: string | IUser;
  providerId: string;
  rating: number; // 1 to 5
  comment: string;
  photos?: string[];
  createdAt: string;
}

export interface IWalletTransaction {
  _id: string;
  providerId: string;
  bookingId?: string;
  type: 'commission_debit' | 'payout' | 'deposit' | 'referral_bonus';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
}

// Nearby Provider Search Query & Response
export interface INearbySearchQuery {
  longitude: number;
  latitude: number;
  radiusKm?: number;
  categoryId?: string;
  subCategoryId?: string;
  searchQuery?: string;
  minRating?: number;
  maxPrice?: number;
  sortBy?: 'distance' | 'rating' | 'price';
}

export interface INearbyProviderResult {
  _id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
  businessName?: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  distanceInMeters: number;
  distanceInKm: number;
  location: IGeoPoint;
  address: IAddress;
  isOnline: boolean;
  pricingModel: PricingModel;
  baseRate?: number;
  ratings: {
    average: number;
    count: number;
  };
  portfolioPhotos: string[];
}

// Payment Payload Types (Nepal)
export interface IEsewaInitiateParams {
  amount: number;
  tax_amount?: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge?: number;
  product_delivery_charge?: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface IKhaltiInitiatePayload {
  return_url: string;
  website_url: string;
  amount: number; // in paisa (NPR * 100)
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

// Socket Events
export enum SocketEvents {
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  PROVIDER_LOCATION_UPDATE = 'provider_location_update',
  PROVIDER_STATUS_TOGGLE = 'provider_status_toggle',
  NEW_JOB_BROADCAST = 'new_job_broadcast',
  JOB_ACCEPTED = 'job_accepted',
  JOB_STATUS_CHANGE = 'job_status_change',
  NOTIFICATION = 'notification',
}
