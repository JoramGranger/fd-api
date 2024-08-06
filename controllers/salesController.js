// controllers/salesController.js
const Order = require('../models/Order');

const getSalesAndRevenue = async (startDate, endDate) => {
  try {
    const pipeline = [
      {
        $match: {
          status: 'Completed',
          createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalSales: { $sum: { $size: '$items' } },
          orderCount: { $sum: 1 }
        }
      }
    ];

    const results = await Order.aggregate(pipeline);
    if (results.length === 0) {
      return { totalRevenue: 0, totalSales: 0, orderCount: 0 };
    }

    const { totalRevenue, totalSales, orderCount } = results[0];
    return { totalRevenue, totalSales, orderCount };
  } catch (err) {
    console.error('Error fetching sales and revenue:', err.message);
    throw new Error('Server error');
  }
};

module.exports = {
  getSalesAndRevenue
};
