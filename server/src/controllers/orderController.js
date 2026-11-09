import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  roundRupees,
  shippingFor
} from '../utils/pricing.js';

const PHONE_PATTERN = /^[0-9+\-\s()]{10,20}$/;

function normaliseItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new ApiError(400, 'Your bag is empty. Add something you love first.');
  }

  const merged = new Map();

  for (const raw of rawItems) {
    const id = String(raw?.productId || raw?.product || raw?._id || '');
    const qty = Number(raw?.qty);

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, 'One of the items in your bag is not valid.');
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      throw new ApiError(400, 'Quantities must be between 1 and 20.');
    }

    merged.set(id, (merged.get(id) || 0) + qty);
  }

  return [...merged.entries()].map(([id, qty]) => ({ id, qty }));
}

function normaliseAddress(raw = {}) {
  const address = {
    fullName: String(raw.fullName || '').trim(),
    phone: String(raw.phone || '').trim(),
    street: String(raw.street || '').trim(),
    city: String(raw.city || '').trim(),
    province: String(raw.province || '').trim(),
    postalCode: String(raw.postalCode || '').trim()
  };

  if (address.fullName.length < 3) throw new ApiError(400, 'Enter the recipient’s full name.');
  if (!PHONE_PATTERN.test(address.phone) || address.phone.replace(/\D/g, '').length < 10) {
    throw new ApiError(400, 'Enter a valid Pakistani phone number, e.g. 0300 1234567.');
  }
  if (address.street.length < 8) {
    throw new ApiError(400, 'Add a complete street address, including house and block.');
  }
  if (!address.city) throw new ApiError(400, 'Enter your city.');
  if (!address.province) throw new ApiError(400, 'Select your province.');
  if (address.postalCode && !/^\d{4,6}$/.test(address.postalCode)) {
    throw new ApiError(400, 'Postal code should be 4 to 6 digits.');
  }

  return address;
}

async function restoreStock(item) {
  await Product.updateOne({ _id: item.product }, [
    {
      $set: {
        stock: { $add: ['$stock', item.qty] },
        soldCount: { $max: [0, { $subtract: [{ $ifNull: ['$soldCount', 0] }, item.qty] }] }
      }
    }
  ]);
}

export const createOrder = asyncHandler(async (req, res) => {
  const requestedItems = normaliseItems(req.body.items);
  const shippingAddress = normaliseAddress(req.body.shippingAddress);

  const paymentMethod = String(req.body.paymentMethod || 'cod');
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    throw new ApiError(400, 'Choose a valid payment method.');
  }

  const notes = String(req.body.notes || '').trim();
  if (notes.length > 500) throw new ApiError(400, 'Order notes can be up to 500 characters.');

  const products = await Product.find({
    _id: { $in: requestedItems.map((item) => item.id) },
    isActive: true
  });

  const productById = new Map(products.map((product) => [String(product._id), product]));

  const lines = requestedItems.map(({ id, qty }) => {
    const product = productById.get(id);
    if (!product) {
      throw new ApiError(409, 'One of the products in your bag is no longer available.');
    }
    if (product.stock < qty) {
      throw new ApiError(
        409,
        `${product.name} has only ${product.stock} left. Please update your bag.`
      );
    }
    return { product, qty };
  });

  const itemsPrice = roundRupees(
    lines.reduce((total, line) => total + line.product.price * line.qty, 0)
  );
  const shippingPrice = shippingFor(itemsPrice);
  const totalPrice = itemsPrice + shippingPrice;

  const decremented = [];
  let order;

  try {
    for (const line of lines) {
      const updated = await Product.findOneAndUpdate(
        { _id: line.product._id, isActive: true, stock: { $gte: line.qty } },
        { $inc: { stock: -line.qty, soldCount: line.qty } }
      );

      if (!updated) {
        throw new ApiError(
          409,
          `${line.product.name} just sold out. Please update your bag and try again.`
        );
      }
      decremented.push(line);
    }

    const orderPayload = {
      user: req.user._id,
      items: lines.map(({ product, qty }) => ({
        product: product._id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        image: product.images?.[0] || '/products/placeholder.svg',
        price: product.price,
        qty
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: 'placed',
      statusHistory: [{ status: 'placed', at: new Date() }],
      isPaid: false,
      paidAt: null,
      notes
    };

    for (let attempt = 0; attempt < 3 && !order; attempt += 1) {
      try {
        order = await Order.create({
          ...orderPayload,
          orderNumber: generateOrderNumber()
        });
      } catch (error) {
        if (error.code === 11000 && attempt < 2) continue;
        throw error;
      }
    }
  } catch (error) {
    await Promise.all(decremented.map(({ product, qty }) => restoreStock({ product: product._id, qty })));
    throw error;
  }

  res.status(201).json({ order });
});

export const myOrders = asyncHandler(async (req, res) => {
  const items = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .lean();

  if (!order) throw new ApiError(404, 'That order could not be found.');

  const ownerId = String(order.user?._id || order.user);
  if (req.user.role !== 'admin' && ownerId !== String(req.user._id)) {
    throw new ApiError(404, 'That order could not be found.');
  }

  res.json({ order });
});

export const listOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const filter = {};

  if (req.query.status && ORDER_STATUSES.includes(req.query.status)) {
    filter.status = req.query.status;
  }

  const keyword = String(req.query.keyword || '').trim();
  if (keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escaped, 'i');
    filter.$or = [
      { orderNumber: pattern },
      { 'shippingAddress.fullName': pattern },
      { 'shippingAddress.phone': pattern },
      { 'shippingAddress.city': pattern }
    ];
  }

  const [items, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter)
  ]);

  res.json({ items, page, pages: Math.ceil(total / limit), total });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'That order could not be found.');

  const requestedStatus = req.body.status;
  const requestedPaid = req.body.isPaid;

  if (!requestedStatus && typeof requestedPaid !== 'boolean') {
    throw new ApiError(400, 'Provide a status or payment update.');
  }
  if (requestedStatus && !ORDER_STATUSES.includes(requestedStatus)) {
    throw new ApiError(400, 'Choose a valid order status.');
  }

  if (requestedStatus && requestedStatus !== order.status) {
    if (order.status === 'cancelled' && requestedStatus !== 'cancelled') {
      throw new ApiError(400, 'A cancelled order cannot be reopened.');
    }
    if (requestedStatus === 'cancelled') {
      if (order.status === 'delivered') {
        throw new ApiError(400, 'Delivered orders cannot be cancelled.');
      }
      await Promise.all(order.items.map(restoreStock));
      order.isPaid = false;
      order.paidAt = null;
    }

    order.status = requestedStatus;
    order.statusHistory.push({ status: requestedStatus, at: new Date() });

    if (requestedStatus === 'delivered' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }
  }

  if (typeof requestedPaid === 'boolean' && order.status !== 'cancelled') {
    order.isPaid = requestedPaid;
    order.paidAt = requestedPaid ? order.paidAt || new Date() : null;
  }

  await order.save();
  res.json({ order });
});
