# Backend - Task Management API

Express.js server with MongoDB for task and user management.

## 🚀 Quick Start

```bash
npm install
npm start
```

Server runs on: `http://0.0.0.0:5500`

## 📝 Environment Setup

Create a `.env` file in the backend directory:

```env
PORT=5500
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key_change_in_production
```

## 🗂️ Project Structure

```
backend/
├── models/
│   ├── User.js         # User schema with roles
│   └── Task.js         # Task schema with priority & dates
├── routes/
│   ├── authRoutes.js   # Login endpoint
│   ├── userRoutes.js   # User CRUD with RBAC
│   └── taskRoutes.js   # Task CRUD with role filtering
├── middleware/
│   └── authMiddleware.js  # JWT validation & authorization
├── server.js           # Express app setup
├── .env               # Environment variables
└── package.json
```

## 🔐 Security Features

### Authentication
- JWT tokens with 1-day expiration
- Password hashing with bcryptjs (10 rounds)
- Token validation on all protected routes

### Authorization
- `protect` middleware: Validates JWT token
- `authorize(...roles)` middleware: Checks user role
- Example: `router.post("/create", protect, authorize("admin", "hrd"), handler)`

### Protected Routes

All routes requiring authentication use the `protect` middleware:

```javascript
router.get("/tasks/my-tasks", protect, (req, res) => {
  // req.user = { id, role }
});
```

Role-based routes use both `protect` and `authorize`:

```javascript
router.post("/users/create", protect, authorize("admin", "hrd"), (req, res) => {
  // Only admin or HRD can create users
});
```

## 📊 API Endpoints

### Authentication
```
POST /api/auth/login
  Body: { employeeNo, password }
  Returns: { token, user: { id, fullName, role, employeeNo } }
```

### Users (Protected)
```
POST /api/users/create
  Auth: Bearer token, Role: admin|hrd
  Body: { employeeNo, firstName, lastName, email, phoneNumber, birthdate, password, role, department }
  Returns: { message, employeeNo, user }

GET /api/users/all
  Auth: Bearer token, Role: admin|hrd|manager|supervisor
  Returns: [{ id, firstName, lastName, email, role, status, ... }]

GET /api/users/:id
  Auth: Bearer token
  Returns: { id, firstName, lastName, ... }

PATCH /api/users/:id
  Auth: Bearer token, Role: admin|hrd
  Body: { firstName, lastName, email, phoneNumber, department, status, role }
  Returns: { message, user }

DELETE /api/users/:id
  Auth: Bearer token, Role: admin
  Returns: { message }
```

### Tasks (Protected)
```
POST /api/tasks/create
  Auth: Bearer token, Role: admin|manager|supervisor
  Body: { taskName, description, assignedTo, priority, dueDate }
  Returns: { message, task }

GET /api/tasks/all
  Auth: Bearer token
  Note: Results filtered by role (worker sees own, supervisor sees assigned, admin sees all)
  Returns: [{ taskName, status, priority, dueDate, ... }]

GET /api/tasks/my-tasks
  Auth: Bearer token
  Returns: Worker's assigned tasks only
  Returns: [{ taskName, status, ... }]

GET /api/tasks/user/:userId
  Auth: Bearer token
  Returns: Tasks assigned to specific user

PATCH /api/tasks/update-status/:id
  Auth: Bearer token
  Body: { status: "pending"|"in-progress"|"review"|"completed" }
  Returns: { message, task }

DELETE /api/tasks/:id
  Auth: Bearer token, Role: admin
  Returns: { message }
```

## 🗄️ Models

### User
```javascript
{
  employeeNo: String (unique, required),
  firstName: String (required),
  lastName: String (required),
  email: String (unique, required),
  phoneNumber: String (required),
  birthdate: Date (required),
  password: String (hashed, required),
  role: "admin" | "hrd" | "manager" | "supervisor" | "worker" (default: worker),
  department: String (optional),
  status: "active" | "inactive" (default: active),
  createdBy: String (default: "admin"),
  createdAt: Date (default: now)
}
```

### Task
```javascript
{
  taskName: String (required),
  description: String,
  assignedTo: ObjectId (ref: User, required),
  assignedBy: ObjectId (ref: User),
  assignedByName: String,
  status: "pending" | "in-progress" | "review" | "completed" (default: pending),
  priority: "low" | "medium" | "high" (default: medium),
  dueDate: Date,
  completedAt: Date,
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

## 🔄 Role-Based Access Control

### Admin
- ✅ Create/Read/Update/Delete users
- ✅ Create/Read/Update/Delete tasks
- ✅ View all data
- ✅ Manage system settings

### HRD
- ✅ Create worker accounts only
- ✅ Read/Update worker details
- ✅ Deactivate workers
- ❌ Cannot manage other roles
- ❌ Cannot delete users (only deactivate)

### Manager
- ✅ Create tasks
- ✅ View assigned tasks
- ✅ Assign tasks to supervisors
- ❌ Cannot create users
- ❌ Cannot view all data

### Supervisor
- ✅ Create tasks
- ✅ View assigned tasks
- ✅ Assign tasks to workers
- ❌ Cannot create users
- ❌ Cannot view manager tasks

### Worker
- ✅ View own tasks
- ✅ Update task status
- ❌ Cannot create tasks
- ❌ Cannot create users

## 🧪 Testing

### Login
```bash
curl -X POST http://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "employeeNo": "EMP001", "password": "password123" }'
```

### Create User (with token)
```bash
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "employeeNo": "EMP002",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phoneNumber": "09123456790",
    "birthdate": "1992-05-20",
    "password": "password456",
    "role": "worker"
  }'
```

### Get All Users
```bash
curl http://localhost:5500/api/users/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📦 Dependencies

- **express** (5.2.1) - Web framework
- **mongoose** (9.2.0) - MongoDB ODM
- **jsonwebtoken** (9.0.3) - JWT authentication
- **bcryptjs** (3.0.3) - Password hashing
- **cors** (2.8.6) - Cross-origin support
- **dotenv** (17.2.4) - Environment variables
- **nodemon** - Auto-restart on changes

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongosh`
- Check MONGO_URI in .env

### "jwt malformed" or "invalid token"
- Ensure Authorization header format: `Bearer TOKEN`
- Check token is still valid (expires in 1 day)

### "Not authorized for this action"
- Verify user role matches endpoint requirements
- Check role value in database

### CORS errors
- Ensure frontend API_BASE matches backend PORT
- Check CORS middleware is enabled in server.js

## 📝 Development Notes

### Adding a New Protected Route
```javascript
const { protect, authorize } = require("../middleware/authMiddleware");

// For all authenticated users
router.get("/my-data", protect, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  // Handle request
});

// For specific roles only
router.post("/admin-only", protect, authorize("admin"), (req, res) => {
  // Only admins can access
});

// Multiple roles
router.delete("/delete", protect, authorize("admin", "hrd"), (req, res) => {
  // Admins and HRD can access
});
```

### Error Handling Pattern
```javascript
try {
  // Do something
  res.json({ message: "Success", data: result });
} catch (error) {
  console.error("Operation Error:", error.message);
  res.status(500).json({ message: "Server error: " + error.message });
}
```

---

**Last Updated:** April 2026
