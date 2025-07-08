const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(m => m.default(...args));

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio file uploaded.' });
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));
    form.append('model', 'groq-speech-1');
    const resp = await fetch('https://api.groq.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, ...form.getHeaders() },
      body: form,
    });
    if (!resp.ok) {
      const err = await resp.json();
      console.error('Groq STT error:', err);
      return res.status(resp.status).json({ error: err });
    }
    const data = await resp.json();
    fs.unlinkSync(req.file.path);
    res.json({ text: data.text });
  } catch (e) {
    console.error('Groq STT exception:', e);
    res.status(500).json({ error: 'Speech transcription failed.' });
  }
});

module.exports = router;
