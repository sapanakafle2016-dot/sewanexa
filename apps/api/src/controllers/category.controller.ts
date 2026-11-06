import { Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { SubCategory } from '../models/SubCategory.js';

export class CategoryController {
  /**
   * List all active service categories and their subcategories
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });

    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (cat) => {
        const subcategories = await SubCategory.find({
          categoryId: cat._id,
          isActive: true,
        }).sort({ order: 1 });

        return {
          ...cat.toObject(),
          subcategories,
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithSubcategories,
    });
  }

  /**
   * Get single category by slug with subcategories
   */
  static async getBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isActive: true });

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    const subcategories = await SubCategory.find({
      categoryId: category._id,
      isActive: true,
    }).sort({ order: 1 });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories,
      },
    });
  }
}

