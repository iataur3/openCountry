const express = require("express");
const router = express.Router();
const { updateViewCount } = require("../utils/viewCount");

router.post("/updateView", async (req, res) => {
  const page = req.body.page;
  if (!page) return res.status(400).json({ error: "Page name required" });

  try {
    const views = await updateViewCount(page);
    res.json({ views });
  } catch (err) {
    console.error("❌ Firestore error:", err.message);
    res.status(500).json({ error: "View count update failed" });
  }
});

module.exports = router;
