const Amadeus = require("amadeus");
const axios = require('axios');

let amadeusAccessToken = null;
let tokenExpiryTime = 0;

const getAmadeusAccessToken = async () => {
  if (amadeusAccessToken && Date.now() < tokenExpiryTime) {
    console.log('Using cached Amadeus access token.');
    return amadeusAccessToken;
  }

  try {
    const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
    const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

    if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
      throw new Error("Amadeus API credentials (CLIENT_ID and CLIENT_SECRET) are not set in environment variables.");
    }

    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      `grant_type=client_credentials&client_id=${AMADEUS_CLIENT_ID}&client_secret=${AMADEUS_CLIENT_SECRET}`,
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

let _amadeusClientInstance = null;

const getAmadeusClient = () => {
  if (_amadeusClientInstance) {
    return _amadeusClientInstance;
  }

  const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
  const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
    console.error("Amadeus API credentials (CLIENT_ID and CLIENT_SECRET) are not set in environment variables. Please check your .env file.");
    throw new Error("Amadeus API credentials missing.");
  }

  const amadeusClient = new Amadeus({
    clientId: AMADEUS_CLIENT_ID,
    clientSecret: AMADEUS_CLIENT_SECRET,
  });

  amadeusClient.client.before = async function(request) {
    console.log('Amadeus client before hook triggered.');
    const token = await getAmadeusAccessToken();
    request.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set.');
  };

  _amadeusClientInstance = amadeusClient;
  return amadeusClient;
};

module.exports = getAmadeusClient;