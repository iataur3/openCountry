const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

// 🔗 Route imports
const viewRoutes = require("./routes/viewRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

admin.initializeApp();
const app = express();
app.use(express.json());

// ✅ Route mounting
app.use("/api", viewRoutes);
app.use("/api", ratingRoutes);

// ✅ Export as Firebase Function
exports.app = functions.https.onRequest(app);
