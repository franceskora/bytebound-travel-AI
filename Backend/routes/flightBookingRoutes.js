const express = require('express');
const router = express.Router();
const { orchestrateFlightBooking } = require('../controllers/flightBookingOrchestrator');

// Define the route for generating the itinerary
router.post('/', orchestrateFlightBooking);

module.exports = router;