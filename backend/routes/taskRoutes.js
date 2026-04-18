const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect, authorize } = require("../middleware/authMiddleware");

// ─────────────────────────────────────────
// POST: /api/tasks/create
// Admin, Manager, Supervisor create tasks
// ─────────────────────────────────────────
router.post(
  "/create",
  protect,
  authorize("admin", "manager", "supervisor"),
  async (req, res) => {
    try {
      const { taskName, description, assignedTo, priority, dueDate } = req.body;

      if (!taskName || !assignedTo) {
        return res.status(400).json({
          message: "Task name and assignedTo are required",
        });
      }

      const newTask = new Task({
        taskName,
        description,
        assignedTo,
        assignedBy: req.user.id,
        assignedByName: req.user.role,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "pending",
      });

      await newTask.save();
      await newTask.populate("assignedTo", "firstName lastName");

      res.status(201).json({
        message: "Task created successfully!",
        task: newTask,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ─────────────────────────────────────────
// GET: /api/tasks/my-tasks
// Get worker's assigned tasks
// ─────────────────────────────────────────
router.get("/my-tasks", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("assignedBy", "firstName lastName role")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// GET: /api/tasks/all
// Get all tasks - role-based filtering
// ─────────────────────────────────────────
router.get("/all", protect, async (req, res) => {
  try {
    let query = {};

    // Workers only see their own tasks
    if (req.user.role === "worker") {
      query = { assignedTo: req.user.id };
    }
    // Supervisors see tasks they assigned and their team's tasks
    else if (req.user.role === "supervisor") {
      query = { assignedBy: req.user.id };
    }
    // Admin and managers see all tasks
    // (no filtering)

    const tasks = await Task.find(query)
      .populate("assignedTo", "firstName lastName employeeNo")
      .populate("assignedBy", "firstName lastName role")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// GET: /api/tasks/user/:userId
// Get tasks assigned to specific user
// ─────────────────────────────────────────
router.get("/user/:userId", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId })
      .populate("assignedBy", "firstName lastName")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// PATCH: /api/tasks/update-status/:id
// Update task status
// ─────────────────────────────────────────
router.patch("/update-status/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in-progress", "review", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updateData = { status, updatedAt: new Date() };

    // Set completedAt if status is completed
    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
      .populate("assignedTo", "firstName lastName")
      .populate("assignedBy", "firstName lastName");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      message: `Task status updated to ${status}`,
      task,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// DELETE: /api/tasks/:id
// Delete task - Admin only
// ─────────────────────────────────────────
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
