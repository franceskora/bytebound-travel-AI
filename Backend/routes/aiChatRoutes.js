const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(r => r.default(...args));
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/', async (req, res) => {
  const { messages, imageUrl } = req.body;
  const formatted = messages.map(m => ({
    role: m.isAi ? 'assistant' : 'user',
    content: m.text || '',
  }));

  // Detect if last user message is asking for booking summary
  const lastUser = formatted.reverse().find(m => m.role === 'user');  
  const wantsBooking = lastUser?.content.toLowerCase().includes('booking');

  const systemPrompt = `
You are a helpful travel agent.  
${wantsBooking
    ? '- **Booking responses ONLY**: output **strict JSON** with keys "booking", "totalCost", "nextSteps".'
    : '- For normal conversational or educational responses, answer using headings, bullets, emojis, markdown format.' }
`.trim();

  const { model } = req.body;
  const body = {
    model: model === 'compound-beta'
      ? 'compound-beta'
      : 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      { role: 'system', content: systemPrompt },
      ...formatted,
    ],
    ...(wantsBooking && { response_format: { type: "json_object" } }),
  };

  if (imageUrl) {
    body.messages.push({
      role: 'user',
      content: JSON.stringify({ type: 'image_url', image_url: { url: imageUrl } })
    });
  }

  try {
    const resp = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const err = await resp.json();
      console.error('Groq error:', err);
      return res.status(resp.status).json({ error: err });
    }

    const data = await resp.json();
    res.json({ reply: data.choices[0].message.content.trim() });
  
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Groq chat failed' });
  }
});

module.exports = router;
