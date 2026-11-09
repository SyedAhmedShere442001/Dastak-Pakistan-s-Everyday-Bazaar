import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    revenueAgg,
    orderCount,
    cancelledCount,
    productCount,
    activeProductCount,
    customerCount,
    recentOrders,
    lowStock,
    statusCounts
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } }
    ]),
    Order.countDocuments(),
    Order.countDocuments({ status: 'cancelled' }),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'customer' }),
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    Product.find({ isActive: true, stock: { $lte: 5 } })
      .sort({ stock: 1 })
      .limit(6)
      .select('name slug brand images stock price')
      .lean(),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
  ]);

  const revenue = revenueAgg[0]?.revenue || 0;
  const completedOrders = revenueAgg[0]?.orders || 0;
  const counts = Object.fromEntries(statusCounts.map((entry) => [entry._id, entry.count]));

  res.json({
    stats: {
      revenue,
      orders: orderCount,
      pendingOrders:
        (counts.placed || 0) + (counts.confirmed || 0) + (counts.packed || 0),
      cancelledOrders: cancelledCount,
      products: productCount,
      activeProducts: activeProductCount,
      customers: customerCount,
      lowStockCount: lowStock.length,
      avgOrderValue: completedOrders ? Math.round(revenue / completedOrders) : 0
    },
    recentOrders,
    lowStock,
    statusCounts
  });
});
