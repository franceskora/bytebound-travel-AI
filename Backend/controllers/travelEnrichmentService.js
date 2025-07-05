const axios = require('axios');

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

const getRichLocationDetails = async (query) => {
  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: TAVILY_API_KEY,
      query: query,
      search_depth: 'basic',
      include_answer: true
    });
    return response.data;
  } catch (error) {
    console.error("Tavily search error:", error.message);
    return { answer: "Could not retrieve extra details at this time." };
  }
};

module.exports = { getRichLocationDetails };