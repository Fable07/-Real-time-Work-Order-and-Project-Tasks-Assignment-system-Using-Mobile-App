#!/usr/bin/env node
/**
 * Database Seeding Script
 * Creates initial admin and test users for testing
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const DB_NAME = "capstone2_db";

const testUsers = [
  {
    employeeNo: "ADMIN001",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    phoneNumber: "09100000001",
    birthdate: new Date("1990-01-15"),
    password: "admin123pass", // Will be hashed
    role: "admin",
    status: "active",
  },
  {
    employeeNo: "HRD001",
    firstName: "HR",
    lastName: "Manager",
    email: "hrd@example.com",
    phoneNumber: "09100000002",
    birthdate: new Date("1991-02-20"),
    password: "hrd123pass",
    role: "hrd",
    status: "active",
  },
  {
    employeeNo: "MANAGER001",
    firstName: "Manager",
    lastName: "User",
    email: "manager@example.com",
    phoneNumber: "09100000003",
    birthdate: new Date("1992-03-25"),
    password: "manager123pass",
    role: "manager",
    status: "active",
  },
  {
    employeeNo: "SUPERVISOR001",
    firstName: "Supervisor",
    lastName: "User",
    email: "supervisor@example.com",
    phoneNumber: "09100000004",
    birthdate: new Date("1993-04-30"),
    password: "supervisor123pass",
    role: "supervisor",
    status: "active",
  },
  {
    employeeNo: "WORKER001",
    firstName: "Worker",
    lastName: "User",
    email: "worker@example.com",
    phoneNumber: "09100000005",
    birthdate: new Date("1995-06-15"),
    password: "worker123pass",
    role: "worker",
    status: "active",
  },
  {
    employeeNo: "WORKER002",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phoneNumber: "09100000006",
    birthdate: new Date("1996-07-20"),
    password: "worker456pass",
    role: "worker",
    status: "active",
  },
];

async function seedDatabase() {
  console.log("🌱 Starting Database Seeding...\n");

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI + DB_NAME);
    console.log("✅ Connected to MongoDB\n");

    // Hash passwords and create users
    console.log("📝 Creating test users...\n");

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existing = await User.findOne({
          employeeNo: userData.employeeNo,
        });

        if (existing) {
          console.log(
            `⏭️  ${userData.employeeNo} (${userData.role}) - Already exists`,
          );
          skippedCount++;
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create user
        const user = new User({
          ...userData,
          password: hashedPassword,
        });

        await user.save();

        console.log(
          `✅ ${userData.employeeNo} (${userData.role}) - Created successfully`,
        );
        console.log(
          `   Email: ${userData.email} | Password: ${userData.password}\n`,
        );
        createdCount++;
      } catch (error) {
        console.log(`❌ ${userData.employeeNo} - Error: ${error.message}\n`);
      }
    }

    console.log("\n╔════════════════════════════════════════╗");
    console.log("║         SEEDING COMPLETE              ║");
    console.log("╚════════════════════════════════════════╝\n");

    console.log(`📊 Summary:`);
    console.log(`   ✅ Created: ${createdCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📝 Total:   ${testUsers.length}\n`);

    console.log("🔑 Test Credentials:\n");
    testUsers.forEach((user) => {
      console.log(
        `   ${user.role.toUpperCase().padEnd(12)} | Employee: ${user.employeeNo.padEnd(14)} | Password: ${user.password}`,
      );
    });

    console.log("\n✨ Ready to test!");
    console.log("   1. Start backend: npm start");
    console.log("   2. Start frontend: npm start (in frontend folder)");
    console.log("   3. Login with any of the credentials above\n");

    await mongoose.connection.close();
    console.log("✅ Database connection closed\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();
