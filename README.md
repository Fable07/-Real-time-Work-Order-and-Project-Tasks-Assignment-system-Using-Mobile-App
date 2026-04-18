# Capstone2 - Task Management System

A comprehensive task management and HR system with role-based dashboards for different user types. Built with Node.js/Express backend and React Native Expo frontend.

## 🎯 System Overview

### Roles & Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Admin** | Full system control - create users, create tasks, view all data, manage system |
| **HRD** | Employee management - create/manage worker accounts, view employee list |
| **Manager** | Team oversight - view assigned tasks, assign tasks to supervisors |
| **Supervisor** | Task delegation - view assigned tasks, assign tasks to workers |
| **Worker** | Task execution - view assigned tasks, update task status |

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally on port 27017)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
```

**Server runs on:** `http://0.0.0.0:5500`

**Environment Variables** (`.env` file):
```env
PORT=5500
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key_change_in_production
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

**Expo Dev Server:** Press `a` for Android or `i` for iOS

**Web Version:** `npm run web`

## 📊 API Documentation

### Authentication
- **POST** `/api/auth/login` - Login with employee number and password

### User Management (Protected)
- **POST** `/api/users/create` - Create new user (Admin/HRD only)
- **GET** `/api/users/all` - Get all users (role-filtered)
- **GET** `/api/users/:id` - Get user details
- **PATCH** `/api/users/:id` - Update user (Admin/HRD only)
- **DELETE** `/api/users/:id` - Deactivate user (Admin only)

### Task Management (Protected)
- **POST** `/api/tasks/create` - Create task (Admin/Manager/Supervisor)
- **GET** `/api/tasks/all` - Get all tasks (role-filtered)
- **GET** `/api/tasks/my-tasks` - Get worker's tasks
- **GET** `/api/tasks/user/:userId` - Get tasks for specific user
- **PATCH** `/api/tasks/update-status/:id` - Update task status
- **DELETE** `/api/tasks/:id` - Delete task (Admin only)

## 🗄️ Database Models

### User Schema
```javascript
{
  employeeNo: String (unique),
  firstName: String,
  lastName: String,
  email: String (unique),
  phoneNumber: String,
  birthdate: Date,
  password: String (hashed),
  role: "admin" | "hrd" | "manager" | "supervisor" | "worker",
  department: String (optional),
  status: "active" | "inactive",
  createdBy: String,
  createdAt: Date
}
```

### Task Schema
```javascript
{
  taskName: String,
  description: String,
  assignedTo: ObjectId (ref: User),
  assignedBy: ObjectId (ref: User),
  assignedByName: String,
  status: "pending" | "in-progress" | "review" | "completed",
  priority: "low" | "medium" | "high",
  dueDate: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- ✅ JWT-based authentication with 1-day expiration
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (RBAC) on all routes
- ✅ Token validation middleware on protected routes
- ✅ Soft delete for users (status: inactive)
- ✅ Environment variables for sensitive data

## 📁 Project Structure

```
capstone2/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login.tsx
│   │   ├── (admin)/
│   │   │   ├── dashboard.tsx
│   │   │   ├── create-user.tsx
│   │   │   ├── create-task.tsx
│   │   │   ├── users.tsx
│   │   │   └── tasks.tsx
│   │   ├── (hrd)/
│   │   │   └── dashboard.tsx
│   │   ├── (manager)/
│   │   │   └── dashboard.tsx
│   │   ├── (supervisor)/
│   │   │   └── dashboard.tsx
│   │   ├── (worker)/
│   │   │   └── dashboard.tsx
│   │   └── _layout.tsx
│   ├── constants/
│   │   ├── api.ts
│   │   └── Colors.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── styles/
│   │   ├── admin/
│   │   ├── hrd/
│   │   ├── manager/
│   │   ├── supervisor/
│   │   ├── worker/
│   │   └── auth/
│   ├── package.json
│   └── app.json
└── README.md (this file)
```

## 🔄 User Flow

### Login Flow
1. User enters employee number + password
2. Backend validates credentials and issues JWT token
3. Token stored in AsyncStorage on mobile
4. User redirected to role-specific dashboard

### Task Assignment Flow
```
Admin/Manager → Create Task → Assigned to Supervisor/Worker
                    ↓
Supervisor → View Task → Assign to Worker
                    ↓
Worker → View Task → Update Status (pending → in-progress → review → completed)
```

## 🧪 Testing Default Credentials

After starting the backend, create a test user:

```bash
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employeeNo": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "09123456789",
    "birthdate": "1990-01-15",
    "password": "password123",
    "role": "admin"
  }'
```

Then login with: Employee No: `EMP001`, Password: `password123`

## 📝 Recent Updates (Phase 1-5)

### Phase 1: Security Issues Fixed ✅
- Fixed hardcoded JWT secret (now uses environment variable)
- Fixed port inconsistency (5000 vs 5500 → now 5500)
- Added authentication middleware to all protected routes
- Added role-based authorization middleware
- Secured user creation and task routes

### Phase 2: HRD Role Added ✅
- Added HRD role to User model with enum
- Created HRD dashboard with employee management
- HRD can only create worker accounts
- HRD can view and manage active employees

### Phase 3: Complete Dashboards ✅
- Enhanced Manager dashboard with task assignment workflow
- Enhanced Supervisor dashboard with worker task management
- Enhanced Worker dashboard with task status updates
- All dashboards have proper data fetching and refresh functionality

### Phase 4: Task Management Enhanced ✅
- Added priority field (low/medium/high)
- Added dueDate field for task deadlines
- Added completedAt timestamp tracking
- Added soft delete capability (status-based)
- Added proper timestamps (createdAt, updatedAt)
- Multi-level task assignment workflow

### Phase 5: Database Models ✅
- User model: Added department field and hrd role
- Task model: Added priority, dueDate, completedAt, assignedBy fields
- Proper enum validation for all status fields
- Soft delete pattern implementation

## 🐛 Known Limitations & Future Enhancements

- [ ] Email notifications when tasks are assigned
- [ ] Performance analytics/reports dashboard
- [ ] Advanced filtering and search functionality
- [ ] Audit logging for all operations
- [ ] Batch user import from CSV
- [ ] Task comments and collaboration
- [ ] Mobile push notifications
- [ ] Offline mode support

## 🤝 Development Tips

### Add a New Route
1. Create the endpoint in `/routes/[name]Routes.js`
2. Use `protect` middleware for authentication
3. Use `authorize("role1", "role2")` for specific roles
4. Update frontend `ENDPOINTS` in `constants/api.ts`

### Add a New Role
1. Update User model enum: `role: { enum: ["...", "newRole"] }`
2. Add case in frontend `_layout.tsx` for routing
3. Create `(newRole)` folder in frontend `app/`
4. Create role-specific screens and styles
5. Update `authorize` checks in backend routes

### Debug Backend
```bash
# Check MongoDB connection
# Clear logs and restart
npm start

# Check API responses
curl -X GET http://localhost:5500/api/users/all \
  -H "Authorization: Bearer TOKEN"
```

### Debug Frontend
```bash
# Clear cache and restart Expo
npm start

# Use React Navigation DevTools (if available)
# Check AsyncStorage: useAuth hook logs
```

## 📞 Support

For issues or questions:
1. Check backend logs: `npm start` output
2. Check frontend console: Expo debugger
3. Verify MongoDB is running: `mongosh`
4. Verify .env variables are set correctly

## 📄 License

This is a capstone project. All rights reserved.

---

**Last Updated:** April 2026
**Version:** 1.0 (Post Security & Architecture Improvements)
