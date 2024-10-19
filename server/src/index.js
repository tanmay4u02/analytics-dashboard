const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const dotenv = require("dotenv");
const cors = require("cors");
const anatyticsRouter = require("./routes/anatytics");
const authMiddleware = require("./middlewares/authMiddleware");

dotenv.config();

const PORT = process.env.PORT || 8000;
const CONN = process.env.CONN;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Authentication Routes
app.use("/api/auth", authRouter);

// Analytics Dashboard Routes
app.use("/api/analytics", authMiddleware, anatyticsRouter);

const start = async () => {
  try {
    await mongoose.connect(CONN);

    app.listen(PORT, () => {
      console.log(`[Server] Listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};

start();
