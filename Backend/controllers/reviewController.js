const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
    req.body.user = req.user.id; // Add the logged-in user to the review body

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    });
});

// @desc    Get all reviews for a specific provider
// @route   GET /api/reviews/:providerName
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ providerName: req.params.providerName });

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

module.exports = { addReview, getReviews };