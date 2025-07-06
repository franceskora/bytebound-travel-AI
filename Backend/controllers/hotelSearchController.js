const amadeus = require('../config/amadeusClient')();

const searchHotels = async (location, adults, checkInDate, checkOutDate) => {
  try {
    let cityCode;
    // Check if the input is a 3-letter IATA code
    if (/^[A-Z]{3}$/.test(location)) {
        cityCode = location;
    } else {
        // Step 0: Convert city name to city code
        const citySearchResponse = await amadeus.referenceData.locations.get({
          keyword: location,
          subType: 'CITY'
        });

        if (!citySearchResponse.data || citySearchResponse.data.length === 0) {
          throw new Error("Could not find city code for the given city name.");
        }
        cityCode = citySearchResponse.data[0].address.cityCode;
    }

    // Step 1: Get hotel IDs by city code
    const hotelListResponse = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode,
    });

    if (!hotelListResponse.data || hotelListResponse.data.length === 0) {
      throw new Error("No hotels found for the given city code.");
    }

    let foundOffers = null;
    for (const hotel of hotelListResponse.data) {
      try {
        // Step 2: Search for hotel offers using the hotel ID and other parameters
        const response = await amadeus.shopping.hotelOffersSearch.get({
          hotelIds: hotel.hotelId,
          adults: adults,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
        });

        if (response.data && response.data.length > 0) {
          foundOffers = response.data;
          break; // Found offers, exit loop
        }
      } catch (innerError) {
        console.warn(`No offers found for hotel ID ${hotel.hotelId} or an error occurred:`, innerError.message);
        // Continue to the next hotel ID
      }
    }

    if (!foundOffers) {
      throw new Error("No hotel offers found after trying all available hotels.");
    }

    return foundOffers;
  } catch (error) {
    console.error("Amadeus Hotel Search Error:", error);
    throw new Error('Failed to search for hotels.');
  }
};

module.exports = { searchHotels };