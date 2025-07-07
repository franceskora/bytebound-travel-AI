const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


// ✅ Groq endpoint: simple HTTPS call
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/', async (req, res) => {
  const { messages, model = 'groq' } = req.body;

  // Convert your messages to OpenAI format
  const formattedMessages = messages.map((m) => ({
    role: m.isAi ? 'assistant' : 'user',
    content: m.text || '',
  }));

  try {
    let reply;

    if (model === 'groq') {
      const groqResponse = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',    //'llama3-8b-8192', // ✅ or use any other Llama model Groq supports
          messages: [
            { role: 'system', content: '“You are a helpful travel assistant. Always format destination recommendations using clear headings, bullet points, and emojis if possible, so it’s easy to read.' },
            ...formattedMessages,
          ],
        }),
      });

      const data = await groqResponse.json();
      reply = data.choices?.[0]?.message?.content?.trim();

    } else {
      return res.status(400).json({ error: 'Invalid model specified.' });
    }

    return res.json({ reply });

  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Something went wrong with the AI chat.' });
  }
});

module.exports = router;
