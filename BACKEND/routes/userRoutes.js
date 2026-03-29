// ─────────────────────────────────────────
// USER ROUTES
// Admin-only routes for managing accounts
// ─────────────────────────────────────────

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ─────────────────────────────────────────
// POST: /api/users/create
// Admin creates a fully verified account
// ─────────────────────────────────────────
router.post("/create", async (req, res) => {
  try {
    const {
      employeeNo,
      firstName,
      lastName,
      phoneNumber,
      email,
      birthdate,
      password,
      role,
      createdBy,
    } = req.body;

    // Validate all required fields
    if (
      !employeeNo ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !birthdate ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if employee number already exists
    const existingEmployeeNo = await User.findOne({ employeeNo });
    if (existingEmployeeNo) {
      return res.status(400).json({
        message: "Employee number already exists.",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      employeeNo,
      firstName,
      lastName,
      phoneNumber,
      email,
      birthdate: new Date(birthdate),
      password: hashedPassword,
      role: role || "worker",
      createdBy: createdBy || "admin",
      status: "active",
    });

    await newUser.save();

    // Return success with employee number
    res.status(201).json({
      message: "Account created successfully",
      employeeNo: newUser.employeeNo,
      user: {
        fullName: `${firstName} ${lastName}`,
        employeeNo,
        role,
      },
    });
  } catch (error) {
    console.error("Error in /create:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ─────────────────────────────────────────
// GET: /api/users/all
// Get all users except passwords
// ─────────────────────────────────────────
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch personnel list." });
  }
});

module.exports = router;
