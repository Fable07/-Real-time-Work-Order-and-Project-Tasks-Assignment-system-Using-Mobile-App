require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Connection
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const DB_NAME = "capstone2_db";

mongoose
  .connect(MONGO_URI + DB_NAME)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

const PORT = process.env.PORT || 5500;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
