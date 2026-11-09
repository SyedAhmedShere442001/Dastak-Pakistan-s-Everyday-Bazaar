import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { uniqueProductSlug } from '../utils/slug.js';

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, numReviews: -1 },
  popular: { soldCount: -1, rating: -1 }
};

const CATEGORY_FIELDS = 'name slug icon';

async function findCategory(value) {
  if (mongoose.isValidObjectId(value)) {
    const byId = await Category.findById(value);
    if (byId) return byId;
  }
  return Category.findOne({ slug: String(value).toLowerCase() });
}

function parseBoolean(value, fallback) {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return fallback;
}

function parseSpecs(value) {
  if (Array.isArray(value)) {
    return value
      .map((spec) => ({
        label: String(spec?.label || '').trim(),
        value: String(spec?.value || '').trim()
      }))
      .filter((spec) => spec.label && spec.value)
      .slice(0, 20);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((line) => {
        const separator = line.indexOf(':');
        if (separator === -1) return null;
        return {
          label: line.slice(0, separator).trim(),
          value: line.slice(separator + 1).trim()
        };
      })
      .filter((spec) => spec && spec.label && spec.value)
      .slice(0, 20);
  }

  return [];
}

function readImages(body) {
  if (Array.isArray(body.images)) {
    return body.images.map((image) => String(image).trim()).filter(Boolean).slice(0, 4);
  }
  if (typeof body.image === 'string' && body.image.trim()) {
    return [body.image.trim()];
  }
  return [];
}

function parseProductPayload(body) {
  const data = {};
  const errors = [];

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (name.length < 2) errors.push('Product name is too short.');
    else data.name = name;
  }

  if (body.brand !== undefined) {
    const brand = String(body.brand).trim();
    if (!brand) errors.push('Brand is required.');
    else data.brand = brand;
  }

  if (body.description !== undefined) {
    const description = String(body.description).trim();
    if (description.length < 10) errors.push('Description should be at least 10 characters.');
    else data.description = description;
  }

  if (body.category !== undefined) {
    data.category = body.category;
    if (!mongoose.isValidObjectId(body.category)) {
      errors.push('Choose a valid category.');
    }
  }

  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) errors.push('Price must be a positive number.');
    else data.price = Math.round(price);
  }

  if (body.compareAtPrice !== undefined) {
    if (body.compareAtPrice === null || body.compareAtPrice === '') {
      data.compareAtPrice = null;
    } else {
      const compareAtPrice = Number(body.compareAtPrice);
      if (!Number.isFinite(compareAtPrice) || compareAtPrice < 0) {
        errors.push('Compare-at price must be a positive number.');
      } else {
        data.compareAtPrice = Math.round(compareAtPrice);
      }
    }
  }

  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (!Number.isInteger(stock) || stock < 0) errors.push('Stock must be a whole number.');
    else data.stock = stock;
  }

  if (body.featured !== undefined) data.featured = parseBoolean(body.featured, false);
  if (body.isActive !== undefined) data.isActive = parseBoolean(body.isActive, true);

  if (body.tags !== undefined) {
    const tags = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',');
    data.tags = tags
      .map((tag) => String(tag).trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 12);
  }

  if (body.specs !== undefined) data.specs = parseSpecs(body.specs);

  const images = readImages(body);
  if (images.length) data.images = images;

  return { data, errors };
}

export const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(48, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
  const filter = { isActive: true };

  const keyword = String(req.query.keyword || '').trim();
  if (keyword) {
    const pattern = new RegExp(escapeRegex(keyword), 'i');
    filter.$or = [
      { name: pattern },
      { brand: pattern },
      { description: pattern },
      { tags: pattern }
    ];
  }

  if (req.query.category) {
    const category = await findCategory(req.query.category);
    if (!category) {
      return res.json({ items: [], page: 1, pages: 0, total: 0 });
    }
    filter.category = category._id;
  }

  if (req.query.brand) {
    filter.brand = new RegExp(`^${escapeRegex(req.query.brand)}$`, 'i');
  }

  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
  if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
    filter.price = {};
    if (Number.isFinite(minPrice)) filter.price.$gte = minPrice;
    if (Number.isFinite(maxPrice)) filter.price.$lte = maxPrice;
  }

  if (req.query.featured === 'true') filter.featured = true;

  const sort = SORTS[req.query.sort] || SORTS.newest;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', CATEGORY_FIELDS)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  res.json({
    items,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

export const listAdminProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));
  const filter = {};

  const keyword = String(req.query.keyword || '').trim();
  if (keyword) {
    const pattern = new RegExp(escapeRegex(keyword), 'i');
    filter.$or = [{ name: pattern }, { brand: pattern }];
  }

  if (req.query.category) {
    const category = await findCategory(req.query.category);
    if (!category) {
      return res.json({ items: [], page: 1, pages: 0, total: 0 });
    }
    filter.category = category._id;
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', CATEGORY_FIELDS)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  res.json({ items, page, pages: Math.ceil(total / limit), total });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', CATEGORY_FIELDS)
    .lean();

  if (!product) throw new ApiError(404, 'That product could not be found.');
  res.json({ product });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', CATEGORY_FIELDS).lean();
  if (!product) throw new ApiError(404, 'That product could not be found.');
  res.json({ product });
});

export const listReviews = asyncHandler(async (req, res) => {
  const product = await Product.exists({ _id: req.params.id });
  if (!product) throw new ApiError(404, 'That product could not be found.');

  const items = await Review.find({ product: req.params.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json({ items });
});

export const addReview = asyncHandler(async (req, res) => {
  const rating = Number(req.body.rating);
  const comment = String(req.body.comment || '').trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ApiError(400, 'Choose a rating between 1 and 5 stars.');
  }
  if (comment.length < 3) {
    throw new ApiError(400, 'Please write a short review.');
  }
  if (comment.length > 600) {
    throw new ApiError(400, 'Reviews can be up to 600 characters long.');
  }

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'That product could not be found.');

  const alreadyReviewed = await Review.exists({ product: product._id, user: req.user._id });
  if (alreadyReviewed) {
    throw new ApiError(409, 'You have already reviewed this product.');
  }

  const review = await Review.create({
    product: product._id,
    user: req.user._id,
    name: req.user.name,
    rating,
    comment
  });

  const nextCount = product.numReviews + 1;
  product.rating =
    Math.round(((product.rating * product.numReviews + rating) / nextCount) * 10) / 10;
  product.numReviews = nextCount;
  await product.save();

  res.status(201).json({
    review,
    rating: product.rating,
    numReviews: product.numReviews
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { data, errors } = parseProductPayload(req.body);

  ['name', 'brand', 'description', 'category', 'price', 'stock'].forEach((field) => {
    if (data[field] === undefined) errors.push(`The ${field} field is required.`);
  });

  if (errors.length) throw new ApiError(400, errors[0], errors);

  const category = await Category.findById(data.category);
  if (!category) throw new ApiError(400, 'Choose a valid category.');

  data.slug = await uniqueProductSlug(data.name);
  if (!data.images?.length) data.images = ['/products/placeholder.svg'];

  const product = await Product.create(data);
  await product.populate('category', CATEGORY_FIELDS);

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'That product could not be found.');

  const { data, errors } = parseProductPayload(req.body);
  if (errors.length) throw new ApiError(400, errors[0], errors);

  if (data.category) {
    const category = await Category.findById(data.category);
    if (!category) throw new ApiError(400, 'Choose a valid category.');
  }

  if (data.name && data.name !== product.name) {
    product.slug = await uniqueProductSlug(data.name, product._id);
  }

  Object.assign(product, data);
  await product.save();
  await product.populate('category', CATEGORY_FIELDS);

  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'That product could not be found.');

  await Review.deleteMany({ product: product._id });
  res.json({ message: `“${product.name}” has been removed from the catalog.` });
});
