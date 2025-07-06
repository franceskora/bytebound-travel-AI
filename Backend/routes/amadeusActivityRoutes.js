// Backend/routes/amadeusActivityRoutes.js
const express = require('express');
const router = express.Router();
const { amadeusActivityController } = require('../controllers/amadeusActivityController');
const { protect } = require('../middleware/auth');

// Define the route for getting nearby activities
// This route is protected and requires authentication
router.post('/nearby', protect, amadeusActivityController.getNearbyActivities);

module.exports = router;
