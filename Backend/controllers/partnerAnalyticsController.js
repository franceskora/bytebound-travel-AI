const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Partner = require('../models/Partner');

const getPartnerAnalytics = asyncHandler(async (req, res) => {
    // Find the partner record associated with the logged-in user
    const partner = await Partner.findOne({ user: req.user.id });

    if (!partner) {
        return res.status(404).json({ message: 'No partner profile found for this user.' });
    }

    // --- Calculate Analytics ---

    // 1. Total bookings this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalBookings = await Booking.countDocuments({
        partner: partner._id,
        bookingDate: { $gte: startOfMonth }
    });

    // 2. Total revenue this month
    const revenueAggregation = await Booking.aggregate([
        { $match: { partner: partner._id, bookingDate: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // 3. Simple booking trend (compare to last month - simplified for hackathon)
    const bookingTrend = 'up'; // In a real app, you'd calculate this

    res.status(200).json({
        status: 'success',
        data: {
            businessName: partner.businessName,
            bookingsThisMonth: totalBookings,
            revenueThisMonth: totalRevenue.toFixed(2),
            bookingTrend: bookingTrend
        }
    });
});

module.exports = { getPartnerAnalytics };