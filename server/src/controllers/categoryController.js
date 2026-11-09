import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCategories = asyncHandler(async (req, res) => {
  const [items, counts] = await Promise.all([
    Category.find().sort({ order: 1, name: 1 }).lean(),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])
  ]);

  const countByCategory = new Map(counts.map((entry) => [String(entry._id), entry.count]));

  res.json({
    items: items.map((category) => ({
      ...category,
      productCount: countByCategory.get(String(category._id)) || 0
    }))
  });
});
