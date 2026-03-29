const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

// 📋 GET ALL TASKS: Para sa Worker Dashboard
router.get("/my-tasks", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate(
      "assignedBy",
      "name",
    ); // Para malaman kung sinong supervisor nag-utos
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📝 CREATE TASK: Supervisor to Worker assignment
router.post("/create", protect, async (req, res) => {
  try {
    const { title, description, workerId } = req.body;
    const newTask = new Task({
      title,
      description,
      assignedTo: workerId,
      assignedBy: req.user.id, // Nanggagaling sa token ng Supervisor
    });
    await newTask.save();
    res.status(201).json({ message: "Task successfully assigned." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔄 UPDATE STATUS: Worker confirms completion
router.patch("/update-status/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json({ message: `Task status updated to ${status}`, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST: Create New Task
router.post("/create", async (req, res) => {
  try {
    const { taskName, description, assignedTo, assignedByName } = req.body;
    const newTask = new Task({
      taskName,
      description,
      assignedTo,
      assignedByName,
    });
    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully!", task: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Kunin ang tasks para sa specific na user (Manager/Supervisor)
router.get("/user/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Lahat ng tasks para sa Admin Recent Activity
router.get("/all", async (req, res) => {
  try {
    // Kinukuha natin ang tasks at "populate" para makuha ang pangalan ng assigned user
    const tasks = await Task.find()
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 }); // Pinakabago muna
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
