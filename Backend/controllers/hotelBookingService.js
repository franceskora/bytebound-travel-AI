const amadeus = require('../config/amadeusClient')();

/**
 * Searches for hotel offers for a specific hotel ID.
 * @param {string} hotelId - The ID of the hotel to search offers for.
 * @param {number} adults - Number of adults.
 * @param {string} checkInDate - Check-in date (YYYY-MM-DD).
 * @param {string} checkOutDate - Check-out date (YYYY-MM-DD).
 * @returns {Promise<Array<object>>} An array of hotel offers.
 */
const getOffersForHotelId = async (hotelId, adults, checkInDate, checkOutDate) => {
  try {
    const response = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: hotelId,
      adults: adults,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    });

    if (response.data && response.data.length > 0) {
      return response.data;
    } else {
      console.warn(`No offers found for hotel ID ${hotelId}. Full response:`, response);
      return [];
    }
  } catch (error) {
    console.error(`Error searching offers for hotel ID ${hotelId}:`, error);
    return []; // Return empty array on error to allow orchestration to continue
  }
};

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

module.exports = { confirmHotelOffer, bookHotel, getOffersForHotelId };