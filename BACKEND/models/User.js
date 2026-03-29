// ─────────────────────────────────────────
// USER MODEL
// Defines the schema for all system users
// Created only by the System Administrator
// ─────────────────────────────────────────

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // ── Identity ──────────────────────────
  // Unique employee number assigned by admin
  employeeNo: {
    type: String,
    required: [true, "Employee number is required"],
    unique: true,
    trim: true,
  },

  // ── Name ──────────────────────────────
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },

  // ── Contact Info ──────────────────────
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },

  // ── Personal Info ─────────────────────
  birthdate: {
    type: Date,
    required: [true, "Birthdate is required"],
  },

  // ── Auth ──────────────────────────────
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  // ── Role ──────────────────────────────
  role: {
    type: String,
    enum: ["admin", "manager", "supervisor", "worker"],
    default: "worker",
  },

  // ── Meta ──────────────────────────────
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdBy: {
    type: String,
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
