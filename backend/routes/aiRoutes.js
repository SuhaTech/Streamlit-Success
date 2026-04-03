const express = require("express");
const router = express.Router();
const axios = require("axios");
const protect = require("../middleware/authMiddleware");

const DEFAULT_AI_SERVICE_URL = "https://streamlit-success-ai.onrender.com";
const normalizeAiUrl = (url) => String(url || "").trim().replace(/\/$/, "");
const isLocalAiUrl = (url) => /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/i.test(String(url || "").trim());
const getAiBases = () => {
  const primary = normalizeAiUrl(process.env.AI_SERVICE_URL || "");
  const list = String(process.env.AI_SERVICE_URLS || "")
    .split(",")
    .map(normalizeAiUrl)
    .filter(Boolean);
  const unique = [...new Set([primary, ...list, normalizeAiUrl(DEFAULT_AI_SERVICE_URL)].filter(Boolean))];
  unique.sort((a, b) => Number(isLocalAiUrl(a)) - Number(isLocalAiUrl(b)));
  return unique;
};
const AI_HEALTH_TIMEOUT_MS = Math.min(Number(process.env.AI_HEALTH_TIMEOUT_MS || 20000), 5000);

const postToAiWithFallback = async (path, payload, timeoutMs) => {
  let lastErr = null;
  for (const base of getAiBases()) {
    try {
      return await axios.post(`${base}${path}`, payload, { timeout: timeoutMs });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("AI service unavailable");
};

const getFromAiWithFallback = async (path, timeoutMs) => {
  let lastErr = null;
  for (const base of getAiBases()) {
    try {
      return await axios.get(`${base}${path}`, { timeout: timeoutMs });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("AI service unavailable");
};

// POST /api/ai/analyze — proxy resume analysis to Python FastAPI
router.post("/analyze", protect, async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ message: "resumeText is required" });

    const response = await postToAiWithFallback("/analyze", { resume_text: resumeText }, 30000);
    res.json(response.data);
  } catch (err) {
    console.error("AI analyze error:", err.message);
    res.status(502).json({ message: "AI service unavailable", error: err.message });
  }
});

// POST /api/ai/recommend — get job recommendations for student
router.post("/recommend", protect, async (req, res) => {
  try {
    const { resumeText, jobs } = req.body;
    if (!resumeText || !jobs) return res.status(400).json({ message: "resumeText and jobs are required" });

    const response = await postToAiWithFallback("/recommend", { resume_text: resumeText, jobs }, 30000);
    res.json(response.data);
  } catch (err) {
    console.error("AI recommend error:", err.message);
    res.status(502).json({ message: "AI service unavailable", error: err.message });
  }
});

// POST /api/ai/skills — extract skills from text
router.post("/skills", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "text is required" });

    const response = await postToAiWithFallback("/skills", { text }, 15000);
    res.json(response.data);
  } catch (err) {
    console.error("AI skills error:", err.message);
    res.status(502).json({ message: "AI service unavailable", error: err.message });
  }
});

// GET /api/ai/health — AI service health check
router.get("/health", async (req, res) => {
  try {
    const response = await getFromAiWithFallback("/health", AI_HEALTH_TIMEOUT_MS);
    res.json(response.data);
  } catch (err) {
    res.status(502).json({ status: "down", error: err.message });
  }
});

module.exports = router;
