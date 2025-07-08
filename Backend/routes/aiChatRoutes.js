const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/', async (req, res) => {
  const { messages, imageUrl } = req.body;  // include imageUrl from client
  const formatted = messages.map(m => ({
    role: m.isAi ? 'assistant' : 'user',
    content: m.text || '',
  }));

  const groqBody = {
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      { role: 'system', content: "You're a helpful travel agent. Answer based on image and text." },
      ...formatted,
    ],
  };

  if (imageUrl) {
    groqBody.messages.push({
      role: 'user',
      content: JSON.stringify({ type: 'image_url', image_url: { url: imageUrl } })
    });
  }

  try {
    const resp = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(groqBody),
    });

    if (!resp.ok) {
      const err = await resp.json();
      console.error('Groq error:', err);
      return res.status(resp.status).json({ error: err });
    }

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    res.json({ reply });

  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Groq chat failed' });
  }
});
