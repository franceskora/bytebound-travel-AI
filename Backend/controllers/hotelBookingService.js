const amadeus = require('../config/amadeusClient')();

/**
 * Confirms a specific hotel offer to ensure the price and availability are still valid.
 * @param {string} offerId - The ID of the hotel offer to be confirmed.
 * @returns {Promise<object>} The confirmed hotel offer details.
 */
const confirmHotelOffer = async (offerId) => {
  try {
    if (!offerId) {
      throw new Error("Hotel Offer ID is required to confirm.");
    }

    // This makes a GET request to the pricing endpoint for a specific offer
    const response = await amadeus.shopping.hotelOfferSearch(offerId).get();
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Amadeus Hotel Confirm Error: ${error.response.statusCode} - ${JSON.stringify(JSON.parse(error.response.body))}`);
    }
    throw error;
  }
};

/**
 * Books a hotel offer using the Amadeus Hotel Booking API v2.
 * @param {object} hotelOrderData - The complete payload for the hotel order, matching Amadeus API v2 specifications.
 * @returns {Promise<object>} The final booking confirmation.
 */
const bookHotel = async (hotelOrderData) => {
  try {
    if (!hotelOrderData || !hotelOrderData.type || !hotelOrderData.guests || !hotelOrderData.roomAssociations || !hotelOrderData.payment) {
      throw new Error("Invalid hotel order data provided. Missing required fields for Amadeus Hotel Booking API v2.");
    }

    console.log('Hotel Booking Payload:', JSON.stringify(hotelOrderData, null, 2));
    const response = await amadeus.booking.hotelOrders.post({
      data: hotelOrderData
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Amadeus Hotel Booking Error: ${error.response.statusCode} - ${JSON.stringify(JSON.parse(error.response.body))}`);
    }
    throw error;
  }
};

module.exports = { confirmHotelOffer, bookHotel };