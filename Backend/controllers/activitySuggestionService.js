const axios = require('axios');
const { getRichLocationDetails } = require('./travelEnrichmentService');

const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function generateActivitySuggestions(location, userPreferences) {
  let tavilyQuery;
  if (userPreferences && userPreferences.length > 0) {
    tavilyQuery = `Things to do in ${location} related to ${userPreferences.join(', ')}`;
  } else {
    tavilyQuery = `Top attractions, activities, restaurants, and tourist places in ${location}`;
  }

  try {
    const tavilyResults = await getRichLocationDetails(tavilyQuery);

    let itinerarySuggestions = [];
    if (tavilyResults.answer || (tavilyResults.results && tavilyResults.results.length > 0)) {
      let llmRefinementPrompt = `Based on the following information about ${location}, generate a concise list of 3-5 actionable itinerary suggestions. Each suggestion should be a short, direct phrase (e.g., "Visit the Eiffel Tower", "Explore the Louvre Museum", "Try a food tour in Le Marais").

`;

      if (tavilyResults.answer) {
        llmRefinementPrompt += `Summary: ${tavilyResults.answer}\n\n`;
      }

      if (tavilyResults.results && tavilyResults.results.length > 0) {
        llmRefinementPrompt += `Key findings:\n`;
        tavilyResults.results.slice(0, 5).forEach(result => { // Limit to top 5 results for brevity
          llmRefinementPrompt += `- ${result.title}: ${result.url}\n`;
        });
      }

      try {
        const llmRefinementResponse = await axios.post(
          GROQ_API_URL,
          {
            model: 'llama3-8b-8192',
            messages: [
              {
                role: 'user',
                content: llmRefinementPrompt
              }
            ],
            temperature: 0.3,
            max_tokens: 200
          },
          {
            headers: {
              'Authorization': `Bearer ${GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const refinedText = llmRefinementResponse.data.choices[0].message.content;
        itinerarySuggestions = refinedText.split('\n').map(line => line.trim()).filter(line => line.length > 0 && !/^(Here are|Optional suggestions|These suggestions)/i.test(line)).map(line => line.replace(/^[0-9]+\.\s*"?|"?$/g, '').trim());

      } catch (llmRefinementError) {
        console.error('Error refining Tavily results with LLM:', llmRefinementError.message);
        itinerarySuggestions = tavilyResults.answer ? [tavilyResults.answer] : ["Could not generate specific itinerary suggestions at this time."];
      }
    }

    return {
      summary: tavilyResults.answer,
      rawResults: tavilyResults.results ? tavilyResults.results.map(r => ({ title: r.title, url: r.url })) : [],
      itinerarySuggestions: itinerarySuggestions
    };
  } catch (tavilyError) {
    console.error('Error fetching Tavily recommendations:', tavilyError.message);
    return { answer: "Could not retrieve recommendations at this time." };
  }
}

// =================================================================
// ===== START: NEW UPSELL MARKETPLACE FUNCTION ====================
// =================================================================
const suggestUpsellProducts = async (destination, availableProducts) => {
  try {
    const prompt = `You are a helpful travel concierge. A user is traveling to ${destination}. From the following list of products, suggest one or two that would be most relevant for their trip. Return your answer as a simple array of product names.

    Available products: ${JSON.stringify(availableProducts)}
    
    User's Destination: ${destination}
    
    Your response should be only the array of product names, for example: ["Universal Travel Adapter", "Portable Neck Pillow"]`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const suggestedProductNames = JSON.parse(response.data.choices[0].message.content);
    
    // Filter the full product details based on the AI's suggestions
    return availableProducts.filter(p => suggestedProductNames.includes(p.name));

  } catch (error) {
    console.error("Upsell suggestion error:", error.message);
    return []; // Return an empty array on failure
  }
};
// =================================================================
// ===== END: NEW UPSELL MARKETPLACE FUNCTION ======================
// =================================================================

module.exports = { generateActivitySuggestions, suggestUpsellProducts };