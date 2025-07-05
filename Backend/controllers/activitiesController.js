// In Backend/controllers/activitiesController.js

const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const findActivities = async (latitude, longitude) => {
  try {
    const response = await amadeus.shopping.activities.get({
      latitude: latitude,
      longitude: longitude,
      radius: 20 // Search within a 20km radius
    });
    return response.data;
  } catch (error) {
    console.error("Amadeus Activities Search Error:", error.response ? error.response.data : error.message);
    throw new Error('Failed to search for activities.');
  }
};

module.exports = { findActivities };