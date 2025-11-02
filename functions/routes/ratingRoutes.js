const express = require("express");
const router = express.Router();
const { submitRating } = require("../utils/rating");

router.post("/ratePage", async (req, res) => {
  const { page, rating } = req.body;
  if (!page || !rating) return res.status(400).json({ error: "Invalid input" });

  try {
    const result = await submitRating(page, parseInt(rating));
    res.json(result);
  } catch (err) {
    console.error("❌ Rating error:", err.message);
    res.status(500).json({ error: "Rating failed" });
  }
});

module.exports = router;
