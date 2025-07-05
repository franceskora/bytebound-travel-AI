const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const searchHotels = async (cityCode) => {
  try {
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode: cityCode,
    });
    return response.data;
  } catch (error) {
    console.error("Amadeus Hotel Search Error:", error.response ? error.response.data : error.message);
    throw new Error('Failed to search for hotels.');
  }
};

module.exports = { searchHotels };