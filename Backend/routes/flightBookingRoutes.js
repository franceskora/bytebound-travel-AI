const express = require('express');
const router = express.Router();
const { orchestrateFlightBooking } = require('../controllers/flightBookingOrchestrator');
const { protect } = require('../middleware/auth');

// Define the route for generating the itinerary
router.post('/', protect, orchestrateFlightBooking);

module.exports = router;