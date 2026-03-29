// ─────────────────────────────────────────
// API CONFIGURATION
// Base URL and all endpoint definitions
// ─────────────────────────────────────────

// Base URL of the backend server
// Change this if your IP address changes
export const API_BASE = "http://10.0.2.2:5500/api";

// ─────────────────────────────────────────
// ENDPOINTS
// All API routes used throughout the app
// ─────────────────────────────────────────
export const ENDPOINTS = {
  // Auth
  login: `${API_BASE}/auth/login`,

  // User management (Admin only)
  createUser: `${API_BASE}/users/create`,
  allUsers: `${API_BASE}/users/all`,

  // Task management
  createTask: `${API_BASE}/tasks/create`,
  allTasks: `${API_BASE}/tasks/all`,

  // Worker - fetch own tasks
  myTasks: `${API_BASE}/tasks/my-tasks`,

  // Fetch tasks assigned to a specific user (Manager / Supervisor)
  tasksByUser: (id: string) => `${API_BASE}/tasks/user/${id}`,

  // Worker updates task status
  updateTaskStatus: (id: string) => `${API_BASE}/tasks/update-status/${id}`,
};