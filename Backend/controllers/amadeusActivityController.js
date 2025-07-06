// Backend/controllers/amadeusActivityController.js
const amadeus = require('../config/amadeusClient')();

/**
 * Fetches nearby activities from Amadeus based on a hotel ID from a booking confirmation.
 *
 * @param {object} bookingResponse - The hotel booking confirmation response from Amadeus.
 * @returns {Promise<Array>} A promise that resolves to an array of activity objects.
 */
async function getActivitiesNearBookedHotel(hotelId) {
    if (!hotelId) {
        throw new Error('hotelId must be provided.');
    }

    try {
        // Step 1: Correctly fetch hotel location by its ID
        const hotelDataResponse = await amadeus.referenceData.locations.hotels.byHotels.get({
            hotelIds: hotelId
        });

        if (!hotelDataResponse.data || hotelDataResponse.data.length === 0) {
            throw new Error(`No hotel found for ID: ${hotelId}`);
        }

        const { latitude, longitude } = hotelDataResponse.data[0].geoCode;

        // Step 2: Get nearby activities using the coordinates
        const activitiesResponse = await amadeus.shopping.activities.get({
            latitude: latitude,
            longitude: longitude,
            radius: 20 // As specified, in Kilometers
        });

        // Step 3: Return the list of activities
        return activitiesResponse.data;

    } catch (error) {
        console.error('Error fetching activities near booked hotel:', error.response ? error.response.data : error.message);
        throw new Error(`Failed to get nearby activities from Amadeus: ${error.message}`);
    }
}

const amadeusActivityController = {
    getNearbyActivities: async (req, res) => {
        try {
            const { hotelId } = req.body;

            if (!hotelId) {
                return res.status(400).json({ message: 'hotelId is required in the request body.' });
            }

            const activities = await getActivitiesNearBookedHotel(hotelId);

            res.status(200).json({
                status: 'success',
                message: 'Successfully retrieved nearby activities.',
                data: activities
            });

        } catch (error) {
            console.error('amadeusActivityController Error:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve nearby activities.',
                error: error.message
            });
        }
    }
};

module.exports = { amadeusActivityController, getActivitiesNearBookedHotel };
