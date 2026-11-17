import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, UserStatus } from '@sewanexa/shared-types';

export interface IUserDocument extends Document {
  phoneNumber?: string;
  isPhoneVerified: boolean;
  name: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  deviceTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    phoneNumber: {
      type: String,
      required: false,
      sparse: true,
      unique: true,
      trim: true,
      index: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
      select: false, // Don't return password hash by default
    },
    avatarUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ['customer', 'provider', 'admin', 'superadmin'],
      default: 'customer',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending_verification'],
      default: 'active',
      index: true,
    },
    deviceTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUserDocument>('User', userSchema);

