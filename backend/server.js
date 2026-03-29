const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes"); // In-import ang userRoutes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Connection
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes); // Dito dadaan ang /api/users/create

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/capstone2_db")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

const PORT = 5500;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
