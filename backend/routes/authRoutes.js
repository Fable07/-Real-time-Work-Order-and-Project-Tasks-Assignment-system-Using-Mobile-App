// ─────────────────────────────────────────
// AUTH ROUTES
// Handles login using Employee Number
// ─────────────────────────────────────────

require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ─────────────────────────────────────────
// POST: /api/auth/login
// Login using Employee Number + Password
// ─────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { employeeNo, password } = req.body;

    // Find user by employee number
    const user = await User.findOne({ employeeNo });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Return token and user info
    res.json({
      token,
      user: {
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role,
        employeeNo: user.employeeNo,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
