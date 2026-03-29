const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  description: { type: String },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ID ng Manager/Supervisor
  assignedByName: { type: String }, // Pangalan ni Admin
  status: {
    type: String,
    enum: ["pending", "in-progress", "review", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", TaskSchema);
