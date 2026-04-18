// ─────────────────────────────────────────
// USER ROUTES
// Admin and HRD manage accounts
// ─────────────────────────────────────────

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { protect, authorize } = require("../middleware/authMiddleware");

// ─────────────────────────────────────────
// POST: /api/users/create
// Admin or HRD creates a new user
// ─────────────────────────────────────────
router.post("/create", protect, authorize("admin", "hrd"), async (req, res) => {
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
      department,
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

    // HRD can only create workers, not other roles
    if (req.user.role === "hrd" && role && role !== "worker") {
      return res.status(403).json({
        message: "HRD can only create worker accounts.",
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
      department: department || null,
      createdBy: req.user.role,
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
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error in /create:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ─────────────────────────────────────────
// GET: /api/users/all
// Get all users - Admin sees all, HRD sees workers
// ─────────────────────────────────────────
router.get(
  "/all",
  protect,
  authorize("admin", "hrd", "manager", "supervisor"),
  async (req, res) => {
    try {
      let query = {};

      // HRD only sees workers in their operations
      if (req.user.role === "hrd") {
        query = { role: "worker", status: "active" };
      }

      const users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({ message: "Failed to fetch personnel list." });
    }
  },
);

// ─────────────────────────────────────────
// GET: /api/users/:id
// Get single user details
// ─────────────────────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ─────────────────────────────────────────
// PATCH: /api/users/:id
// Update user details - Admin & HRD only
// ─────────────────────────────────────────
router.patch("/:id", protect, authorize("admin", "hrd"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      department,
      status,
      role,
    } = req.body;

    // HRD cannot change roles
    if (req.user.role === "hrd" && role) {
      return res.status(403).json({ message: "HRD cannot change user roles" });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email) updateData.email = email;
    if (department) updateData.department = department;
    if (status && req.user.role === "admin") updateData.status = status;
    if (role && req.user.role === "admin") updateData.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ─────────────────────────────────────────
// DELETE: /api/users/:id (Soft Delete)
// Deactivate user - Admin only
// ─────────────────────────────────────────
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;
