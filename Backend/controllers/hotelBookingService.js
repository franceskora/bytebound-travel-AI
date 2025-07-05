// In Backend/controllers/hotelBookingService.js

const Amadeus = require("amadeus");

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

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
    const response = await amadeus.shopping.hotelOffer(offerId).get();
    return response.data;
  } catch (error) {
    console.error("Amadeus Hotel Confirm Error:", error.response ? error.response.data : error.message);
    throw new Error('Failed to confirm hotel offer.');
  }
};

/**
 * Books a previously confirmed hotel offer.
 * @param {string} offerId - The ID of the confirmed hotel offer.
 * @param {Array<object>} guests - An array of guest information objects.
 * @returns {Promise<object>} The final booking confirmation.
 */
const bookHotel = async (offerId, guests) => {
  try {
    if (!offerId || !guests) {
      throw new Error("A valid Offer ID and guest information are required to book a hotel.");
    }

    // The Amadeus API for hotel booking requires a guest object
    const response = await amadeus.booking.hotelBookings.post(
      JSON.stringify({
        data: {
          offerId: offerId,
          guests: guests,
          // Payment details would be handled here in a real-world scenario
        },
      })
    );
    return response.data;
  } catch (error) {
    console.error("Amadeus Hotel Booking Error:", error.response ? error.response.data : error.message);
    throw new Error('Failed to book hotel.');
  }
};

module.exports = { confirmHotelOffer, bookHotel };