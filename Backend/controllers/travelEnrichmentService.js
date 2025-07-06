const { tavily } = require("@tavily/core");
const amadeus = require('../config/amadeusClient')();

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

const tvly = tavily({ apiKey: TAVILY_API_KEY });

const getCityNameFromIata = async (iataCode) => {
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: iataCode,
      subType: 'CITY'
    });
    if (response.data && response.data.length > 0) {
      return response.data[0].address.cityName;
    }
    return iataCode; // Return original if not found
  } catch (error) {
    console.error(`Error getting city name for IATA code ${iataCode}:`, error.message);
    return iataCode; // Return original on error
  }
};

const getRichLocationDetails = async (query) => {
  try {
    const response = await tvly.search(query, {
      search_depth: 'basic',
      include_answer: true
    });
    return response;
  } catch (error) {
    console.error("Tavily search error:", error.message);
    return { answer: "Could not retrieve extra details at this time." };
  }
};

module.exports = { getRichLocationDetails, getCityNameFromIata };