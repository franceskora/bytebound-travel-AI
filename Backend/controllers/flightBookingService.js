const Amadeus = require("amadeus");

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const confirmFlight = async (flight) => {
  try {
    if (!flight) {
      throw new Error("Flight data is required");
    }

    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flight],
        },
      })
    );

    return response.result;
  } catch (error) {
    if (error.response) {
      console.error(error.response.body);
      throw new Error(`Amadeus API Error (Confirm Flight): ${error.response.statusCode} - ${JSON.stringify(JSON.parse(error.response.body))}`);
    }
    console.error(error);
    throw new Error("Failed to confirm flight price");
  }
};

const bookFlight = async (flightOffer, travelers) => {
  try {
    if (!flightOffer || !travelers || !Array.isArray(travelers) || travelers.length === 0) {
      throw new Error("Flight offer and an array of traveler data are required");
    }

    const response = await amadeus.booking.flightOrders.post(
      JSON.stringify({
        data: {
          type: "flight-order",
          flightOffers: [flightOffer],
          travelers: travelers,
        },
      })
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