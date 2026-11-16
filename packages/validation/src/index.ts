import { z } from 'zod';

// Nepal phone number validation: 98XXXXXXXX, 97XXXXXXXX, or with +977 / 977 prefix
export const nepalPhoneRegex = /^(?:\+?977[- ]?)?(9[78]\d{8})$/;

export const phoneAuthSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(nepalPhoneRegex, 'Please enter a valid Nepali mobile number (e.g., 98XXXXXXXX or 97XXXXXXXX)'),
});

export const verifyOtpSchema = z.object({
  phoneNumber: z.string().trim().regex(nepalPhoneRegex, 'Invalid Nepali mobile number'),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric').optional(),
  firebaseIdToken: z.string().optional(),
});

export const googleAuthSchema = z.object({
  email: z.string().email('Valid Gmail address is required').optional(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  googleId: z.string().optional(),
  idToken: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  avatarUrl: z.string().url('Invalid URL').optional(),
});

export const providerRegisterSchema = z.object({
  businessName: z.string().max(100).optional(),
  bio: z.string().min(10, 'Please write at least 10 characters describing your services').max(1000),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  subCategories: z.array(z.string()).min(1, 'Select at least one subcategory'),
  skills: z.array(z.string()).min(1, 'Add at least one skill tag'),
  experienceYears: z.number().int().min(0).max(60),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
      z.number().min(80).max(89), // Nepal longitude bounds approximately 80 to 89
      z.number().min(26).max(31), // Nepal latitude bounds approximately 26 to 31
    ]),
  }),
  address: z.object({
    city: z.string().min(2),
    areaName: z.string().min(2),
    formattedAddress: z.string().min(3),
    landmark: z.string().optional(),
  }),
  serviceRadiusKm: z.number().min(1).max(50).default(5),
  pricingModel: z.enum(['fixed', 'hourly', 'quotation']).default('fixed'),
  baseRate: z.number().nonnegative().optional(),
  documents: z.object({
    identityDocType: z.enum(['citizenship', 'driving_license', 'national_id', 'business_pan']),
    identityNumber: z.string().min(3, 'Identity document number is required'),
    citizenshipFront: z.string().min(1, 'Identity document front image is required'),
    citizenshipBack: z.string().optional(),
    businessRegistration: z.string().optional(),
  }),
  portfolioPhotos: z.array(z.string()).optional().default([]),
});

export const createBookingSchema = z.object({
  providerId: z.string().optional(), // optional if broadcast
  bookingType: z.enum(['direct', 'broadcast']).default('direct'),
  categoryId: z.string().min(1, 'Category is required'),
  subCategoryId: z.string().min(1, 'Subcategory is required'),
  jobLocation: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  address: z.object({
    city: z.string().min(2),
    areaName: z.string().min(2),
    formattedAddress: z.string().min(3),
    landmark: z.string().optional(),
  }),
  scheduledTime: z.string().datetime().or(z.date()),
  description: z.string().min(10, 'Please describe the problem or service needed in at least 10 characters'),
  problemPhotos: z.array(z.string()).optional().default([]),
  paymentMethod: z.enum(['cash', 'esewa', 'khalti']).default('cash'),
  estimatedAmount: z.number().nonnegative().optional(),
});

export const nearbySearchQuerySchema = z
  .object({
    longitude: z.coerce.number().min(80).max(89),
    latitude: z.coerce.number().min(26).max(31),
    radiusKm: z.coerce.number().min(0.5).max(50).default(5),
    categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    searchQuery: z.string().optional(),
    q: z.string().optional(),
    minRating: z.coerce.number().min(1).max(5).optional(),
    maxPrice: z.coerce.number().positive().optional(),
    sortBy: z.enum(['distance', 'rating', 'price']).default('distance'),
  })
  .transform((data) => ({
    ...data,
    searchQuery: data.searchQuery || data.q,
  }));

export const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3, 'Comment must be at least 3 characters').max(1000),
  photos: z.array(z.string()).optional(),
});

export const esewaInitiateSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().positive(),
});

export const khaltiInitiateSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().positive(),
});

