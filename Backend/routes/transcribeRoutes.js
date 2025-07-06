const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");

const router = express.Router();

// Multer storage config preserving extensions
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.filename}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No audio file." });

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));
    form.append("model", "distil-whisper-large-v3-en");
    form.append("language", "en");

    const resp = await axios.post(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );

    fs.unlinkSync(req.file.path);
    res.json({ text: resp.data.text });
  } catch (err) {
    console.error("Groq transcription error:", err.response?.data || err.message);
    res.status(500).json({ error: "Transcription failed" });
  }
});

module.exports = router;
