import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubCategoryDocument extends Document {
  categoryId: Types.ObjectId;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  suggestedBasePrice?: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const subCategorySchema = new Schema<ISubCategoryDocument>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    icon: {
      type: String,
    },
    description: {
      type: String,
      default: '',
    },
    suggestedBasePrice: {
      type: Number,
      default: 500, // In NPR
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.index({ categoryId: 1, slug: 1 }, { unique: true });

export const SubCategory = mongoose.model<ISubCategoryDocument>(
  'SubCategory',
  subCategorySchema
);
