// Backend/controllers/flightSearchController.js

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
      const { origin, destination, departureDate, returnDate, adults, travelClass } = req.body;
      
      if (!origin || !destination || !departureDate || !adults) {
        return res.status(400).json({ message: 'Missing required flight search parameters.' });
      }

      const originCode = await getCityCode(origin);
      const destinationCode = await getCityCode(destination);
      
      let amadeusResponse;
      try {
        const searchParams = {
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDate: departureDate,
          adults: String(adults), // Ensure adults is a string
          travelClass: travelClass || 'ECONOMY',
          currencyCode: 'USD', // It's good practice to specify a currency
          nonStop: false // Set to true if you only want direct flights
        };

        // --- THIS IS THE FINAL DEBUGGING LOG ---
        console.log("SENDING TO AMADEUS:", JSON.stringify(searchParams, null, 2));
        // ----------------------------------------

        if (returnDate) {
          searchParams.returnDate = returnDate;
        }

        amadeusResponse = await amadeus.shopping.flightOffersSearch.get(searchParams);
        
      } catch (amadeusGetError) {
        // This will now log the detailed error from Amadeus
        console.error("AMADEUS API ERROR:", amadeusGetError.response ? amadeusGetError.response.data : amadeusGetError.message);
        throw amadeusGetError; 
      }

      res.status(200).json({
        message: 'Flight search completed successfully',
        searchParams: searchParams,
        flights: amadeusResponse.data,
      });
    } catch (error) {
      console.error('Flight Search Controller Error:', error.message);
      res.status(500).json({ message: 'Failed to search flights', error: error.message });
    }
  },
};

module.exports = flightSearchController;