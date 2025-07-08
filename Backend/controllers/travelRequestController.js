const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function extractTravelRequest(req) {
  try {
    const userInput = req.body.text;
    if (!userInput) {
      throw new Error('Missing user input text');
    }

    // Call Groq LLM API
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: `Your job is to act as a highly accurate travel request parser. Extract all relevant travel details from the user\'s request and format them into a JSON object with three main sections: "flight", "hotel", and "activities".

            **General Intent Recognition:**
            - If the user asks to "plan a trip" or similar general travel planning, assume they want both flight and hotel details extracted, unless explicitly stated otherwise (e.g., "plan a flight only").
            - If the user explicitly asks for "plan a flight" or similar, only extract flight details.

            For the "flight" section, include:
            - "origin": (string, IATA code or city name, e.g., "LHR", "London")
            - "destination": (string, IATA code or city name, e.g., "JFK", "New York")
            - "departureDate": (string, YYYY-MM-DD format, e.g., "2025-07-15")
            - "returnDate": (string, YYYY-MM-DD format, optional.
            - By default, assume a round-trip. If a trip duration is specified (e.g., '7 days') along with a 'departureDate', calculate the 'returnDate' by adding the duration to the 'departureDate'.
            - If the user explicitly mentions "one-way", "single journey", or similar, set 'returnDate' to null.
            - If the user mentions a hotel stay duration (e.g., "4 days stay at hotel") without explicitly mentioning a return flight, infer a one-way flight and set 'returnDate' to null.
            - If neither is explicitly provided nor inferable from duration, set to null.
            e.g., "2025-07-20")
            - "adults": (number, optional, default to 1 if not specified)
            - "children": (number, optional, default to 0 if not specified)
            - "travelClass": (string, optional, e.g., "ECONOMY", "BUSINESS", "FIRST", default to "ECONOMY")
            - "preferences": (array of strings, optional, e.g., ["direct flights", "specific airline"])

            For the "hotel" section, include:
            - "location": (string, city name or specific address. If not explicitly provided but a flight destination is, infer hotel location from flight destination.)
            - "checkInDate": (string, YYYY-MM-DD format. If not explicitly provided but a flight departure date is, infer hotel check-in date from flight departure date.)
            - "checkOutDate": (string, YYYY-MM-DD format. If not explicitly provided but a flight return date is, infer hotel check-out date from flight return date. If only flight departure date and trip duration are given, infer from those.)
            - "guests": (number, total number of guests. If not explicitly provided, infer from flight adults count.)
            - "rooms": (number, optional, default to 1 if not specified)
            - "preferences": (array of strings, optional, e.g., ["5-star", "boutique", "near beach"])

            For the "activities" section, include:
            - "location": (string, city name or specific address, if different from hotel)
            - "userPreferences": (array of strings, e.g., ["museums", "hiking", "food tours", "nightlife", "explore the city", "taste the food", "relax", "spend time alone"]. Extract any explicit or implicit preferences related to the user's desired travel style or activities.)
            - "dates": (array of strings, YYYY-MM-DD format, optional, specific dates for activities)

            If information for a section or a field is not explicitly provided or cannot be reasonably inferred, set its value to null or an appropriate default as specified. Do not make up information.

            Only return the valid JSON object. Do not include any explanation, markdown, or conversational text outside the JSON.

            User request: "${userInput}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rawText = response.data.choices[0].message.content;

    // Function to strip markdown-style code blocks
    const extractJsonFromLLMOutput = (text) => {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      return match ? match[1].trim() : text.trim();
    };

    const cleanedText = extractJsonFromLLMOutput(rawText);

    // Attempt to parse the cleaned JSON
    let travelRequest;
    try {
      travelRequest = JSON.parse(cleanedText);
    } catch (parseError) {
      throw new Error(`Failed to parse travel request JSON from LLM response: ${parseError.message}. Raw: ${rawText}`);
    }

    

    return travelRequest;
  } catch (error) {
    console.error('Error extracting travel request:', error.message);

    if (error.response) {
      console.error('Groq API response error data:', error.response.data);
      console.error('Groq API response status:', error.response.status);
      console.error('Groq API response headers:', error.response.headers);
      throw new Error(`Groq API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('Groq API request error:', error.request);
      throw new Error(`Groq API request error: ${error.message}`);
    } else {
      console.error('Error message:', error.message);
      throw error; // Re-throw the original error
    }
  }
}

module.exports = { extractTravelRequest };
