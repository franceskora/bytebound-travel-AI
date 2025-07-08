const express = require('express');
const multer = require('multer');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const STT_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const TTS_URL = 'https://api.groq.com/openai/v1/audio/speech';

router.post('/voice-session', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio.' });

  try {
    // 1. Speech → Text (STT)
    const sttRes = await fetch(STT_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: (() => {
        const form = new (require('form-data'))();
        form.append('file', fs.createReadStream(req.file.path));
        form.append('model', 'whisper-large-v3-turbo');
        return form;
      })(),
    });
    const { text } = await sttRes.json();

    // 2. LLM Chat (your existing chat logic)
    const aiReplyText = await chatWithGroq(text, req.body.history);
    
    // 3. Text → Speech (TTS)
    const ttsRes = await fetch(TTS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'playai-tts',
        input: aiReplyText,
        voice: 'Celeste-PlayAI',
        response_format: 'wav',
      }),
    });
    const audioBuffer = await ttsRes.arrayBuffer();

    fs.unlinkSync(req.file.path);
    res.json({ text: aiReplyText, audio: Buffer.from(audioBuffer).toString('base64') });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Voice session failed.' });
  }
});

module.exports = router;
