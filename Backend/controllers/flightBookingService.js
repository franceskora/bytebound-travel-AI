const amadeus = require('../config/amadeusClient')();

const confirmFlight = async (flight) => {
  try {
    if (!flight) {
      throw new Error("Flight data is required");
    }
    console.log('Confirming flight with data:', JSON.stringify(flight, null, 2)); // Added logging

    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flight],
        },
      })
    );

    console.log('Flight confirmation successful. Response:', JSON.stringify(response.result, null, 2)); // Added logging
    return response.result;
  } catch (error) {
    if (error.response) {
      console.error('Error during flight confirmation:', error.response.body); // Modified logging
      throw new Error(`Amadeus API Error (Confirm Flight): ${error.response.statusCode} - ${JSON.stringify(JSON.parse(error.response.body))}`);
    }
    console.error('Error during flight confirmation:', error); // Modified logging
    throw new Error("Failed to confirm flight price");
  }
};

const bookFlight = async (flightOffer, travelers) => {
  try {
    if (!flightOffer || !travelers || !Array.isArray(travelers) || travelers.length === 0) {
      throw new Error("Flight offer and an array of traveler data are required");
    }

    const payload = {
      data: {
        type: "flight-order",
        flightOffers: [flightOffer],
        travelers: travelers,
      },
    };
    

    const response = await amadeus.booking.flightOrders.post(
      JSON.stringify(payload)
    );

    return response.result;
  } catch (error) {
    if (error.response) {
      console.error(error.response.body);
      throw new Error(`Amadeus API Error (Book Flight): ${error.response.statusCode} - ${JSON.stringify(JSON.parse(error.response.body))}`);
    }
    console.error(error);
    throw new Error("Failed to book flight");
  }
};

module.exports = { confirmFlight, bookFlight };