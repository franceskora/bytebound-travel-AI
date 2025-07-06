// Backend/controllers/flightSearchController.js

const axios = require('axios');
const amadeus = require('../config/amadeusClient')();

const getCityCode = async (location) => {
    // If the location is 3 letters, assume it's an IATA code.
    if (location && location.length === 3 && /^[A-Z]+$/.test(location)) {
        return location;
    }

    // Otherwise, query Amadeus for the location's IATA code.
    try {
        const response = await amadeus.referenceData.locations.get({
            keyword: location,
            subType: 'AIRPORT'
        });
        // Find the first location with an IATA code and return it.
        const iataCode = response.data.find(loc => loc.iataCode)?.iataCode;
        if (iataCode) {
            return iataCode;
        }
        throw new Error('No IATA code found for the location.');
    } catch (error) {
        console.error(`Error fetching IATA code for ${location}:`, error.message);
        throw new Error(`Could not retrieve a valid airport code for ${location}.`);
    }
};

const flightSearchController = {
  searchFlights: async (req, res) => {
    try {
      const { origin, destination, departureDate, returnDate, adults } = req.body;
      

      if (!origin || !destination || !departureDate || !adults) {
        return res.status(400).json({ message: 'Missing required flight search parameters.' });
      }

      const originCode = await getCityCode(origin);
      const destinationCode = await getCityCode(destination);
      

      

      let amadeusResponse;
      try {
        amadeusResponse = await amadeus.shopping.flightOffersSearch.get({
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDate: departureDate,
          adults: adults
        });
        
        
      } catch (amadeusGetError) {
        console.error('flightSearchController: Error during amadeus.shopping.flightOffersSearch.get():', amadeusGetError.response ? amadeusGetError.response.data : amadeusGetError.message);
        throw amadeusGetError; // Re-throw to be caught by the outer catch block
      }

      res.status(200).json({
        message: 'Flight search completed successfully',
        searchParams: { origin, destination, departureDate, returnDate, adults },
        flights: amadeusResponse.data, // Return the full Amadeus data
      });
    } catch (error) {
      console.error('flightSearchController: Error during Amadeus flight search:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Failed to search flights', error: error.message });
    }
  },
};

module.exports = flightSearchController;