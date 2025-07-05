// Backend/controllers/flightSearchController.js

const axios = require('axios');

const AMADEUS_API_KEY = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_API_SECRET = process.env.AMADEUS_CLIENT_SECRET;

let amadeusAccessToken = null;
let tokenExpiryTime = 0;

const getAmadeusAccessToken = async () => {
  if (amadeusAccessToken && Date.now() < tokenExpiryTime) {
    return amadeusAccessToken;
  }

  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    amadeusAccessToken = response.data.access_token;
    tokenExpiryTime = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 minute before expiry
    console.log('Amadeus access token obtained successfully.');
    return amadeusAccessToken;
  } catch (error) {
    console.error('Error obtaining Amadeus access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to obtain Amadeus access token');
  }
};

const flightSearchController = {
  searchFlights: async (req, res) => {
    try {
      const { origin, destination, departureDate, returnDate, adults } = req.body;

      if (!origin || !destination || !departureDate || !adults) {
        return res.status(400).json({ message: 'Missing required flight search parameters.' });
      }

      const accessToken = await getAmadeusAccessToken();

      const amadeusApiUrl = 'https://test.api.amadeus.com/v2/shopping/flight-offers'; // Changed to test API URL
      const params = {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departureDate,
        adults: adults,
        'max': 10, // Example: Limit results to 10
      };

      if (returnDate) {
        params.returnDate = returnDate;
      }

      console.log('Calling Amadeus Flight Offers API with params:', params);

      const amadeusResponse = await axios.get(amadeusApiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: params,
      });

      res.status(200).json({
        message: 'Flight search completed successfully',
        searchParams: { origin, destination, departureDate, returnDate, adults },
        flights: amadeusResponse.data.data, // Return the full Amadeus data
      });
    } catch (error) {
      console.error('Error during Amadeus flight search:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Failed to search flights', error: error.message });
    }
  },
};

module.exports = flightSearchController;