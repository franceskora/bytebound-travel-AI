const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, addReview); // Only logged-in users can post a review

router.route('/:providerName')
    .get(getReviews); // Anyone can get reviews for a provider

module.exports = router;