# Quick Reference Guide - Capstone2

## 🚀 Running the Project

### Start Everything (2 Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Runs on http://localhost:5500

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Press `a` for Android, `i` for iOS, `w` for web

---

## 🔐 User Roles & Permissions

| Action | Admin | HRD | Manager | Supervisor | Worker |
|--------|-------|-----|---------|------------|--------|
| Create User | ✅ All | ✅ Workers Only | ❌ | ❌ | ❌ |
| View Users | ✅ All | ✅ Active Only | ❌ | ❌ | ❌ |
| Create Task | ✅ | ❌ | ✅ | ✅ | ❌ |
| Assign Task | ✅ | ❌ | ✅ to Sup | ✅ to Worker | ❌ |
| Update Task | ✅ | ❌ | ✅ | ✅ | ✅ Own Only |
| View Tasks | ✅ All | ❌ | ✅ Own | ✅ Own | ✅ Own |
| Delete Task | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 📝 API Quick Reference

### Login (No Auth Required)
```bash
POST /api/auth/login
Body: { "employeeNo": "EMP001", "password": "pass123" }
```

### Create User (Admin/HRD Only)
```bash
POST /api/users/create
Headers: Authorization: Bearer TOKEN
Body: {
  "employeeNo": "EMP002",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "09123456789",
  "birthdate": "1990-01-15",
  "password": "password123",
  "role": "worker",
  "department": "Sales"
}
```

### Get All Users (Admin/HRD)
```bash
GET /api/users/all
Headers: Authorization: Bearer TOKEN
```

### Create Task (Admin/Manager/Supervisor)
```bash
POST /api/tasks/create
Headers: Authorization: Bearer TOKEN
Body: {
  "taskName": "Complete Report",
  "description": "Finish quarterly report",
  "assignedTo": "USER_ID",
  "priority": "high",
  "dueDate": "2026-05-01"
}
```

### Get My Tasks (Worker)
```bash
GET /api/tasks/my-tasks
Headers: Authorization: Bearer TOKEN
```

### Update Task Status
```bash
PATCH /api/tasks/update-status/TASK_ID
Headers: Authorization: Bearer TOKEN
Body: { "status": "in-progress" }
```

---

## 🎯 Default Test User

Once backend is running, you can use the admin create endpoint to create test users:

**Admin Account:**
```
Employee No: ADMIN001
Password: admin123pass
Role: admin
```

**HRD Account:**
```
Employee No: HRD001
Password: hrd123pass
Role: hrd
```

---

## 📊 Database Connection

**MongoDB:**
```
Local: mongodb://localhost:27017/capstone2_db
```

To verify connection is working:
```bash
mongosh
use capstone2_db
db.users.find().limit(1)
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongosh

# Check port 5500 is available
lsof -i :5500

# Verify .env file exists
cat .env
```

### Frontend can't connect to backend
```bash
# Verify API_BASE in constants/api.ts
# For Android emulator: http://10.0.2.2:5500/api
# For physical device: http://YOUR_IP:5500/api
# For web: http://localhost:5500/api
```

### Token expired error
```bash
# Token expires in 1 day
# Login again to get new token
# Check JWT_SECRET in .env matches code
```

### Port already in use
```bash
# Backend port 5500
lsof -i :5500
kill -9 PID

# Frontend port 8081/8082
lsof -i :8081
lsof -i :8082
```

---

## 📱 Frontend Routes

```
/(auth)/login                    - Login screen
/(admin)/dashboard              - Admin overview
/(admin)/create-user            - Create employee
/(admin)/create-task            - Create task
/(admin)/users                  - All users list
/(admin)/tasks                  - All tasks list
/(hrd)/dashboard                - HR overview
/(manager)/dashboard            - Manager overview
/(supervisor)/dashboard         - Supervisor overview
/(worker)/dashboard             - Worker tasks
```

---

## 🔧 Environment Variables

**Backend (.env):**
```env
PORT=5500
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key_change_in_production
```

**Frontend (constants/api.ts):**
```typescript
export const API_BASE = "http://10.0.2.2:5500/api";  // Android
export const API_BASE = "http://192.168.x.x:5500/api"; // Physical device
export const API_BASE = "http://localhost:5500/api";   // Web
```

---

## 📋 Common Tasks

### Create a new admin user
```bash
# Via API
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "employeeNo": "ADM002",
    "firstName": "Jane",
    "lastName": "Admin",
    "email": "jane@admin.com",
    "phoneNumber": "09123456789",
    "birthdate": "1992-01-15",
    "password": "securepass123",
    "role": "admin"
  }'
```

### Assign task to worker
1. Login as Manager/Supervisor
2. View your tasks
3. Tap a task
4. Select worker from modal
5. Task sent to worker

### Update task completion
1. Login as Worker
2. Go to dashboard
3. Tap task to update status
4. Select "completed"
5. Task marked as done

### Deactivate user (Soft Delete)
```bash
curl -X DELETE http://localhost:5500/api/users/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 💾 Backup Database

```bash
# Export
mongodump --uri="mongodb://localhost:27017/capstone2_db" \
  --out=./backup

# Import
mongorestore --uri="mongodb://localhost:27017/capstone2_db" \
  ./backup/capstone2_db
```

---

## 📈 Performance Tips

1. **Reduce API calls** - Batch requests when possible
2. **Cache data** - Use AsyncStorage for user data
3. **Lazy load** - Load task lists on demand
4. **Optimize images** - Keep frontend assets small
5. **Monitor tokens** - Refresh before expiration

---

## 🔍 Debug Commands

### Check API endpoint
```bash
curl http://localhost:5500/api/users/all \
  -H "Authorization: Bearer TOKEN"
```

### Check server logs
```bash
# Backend logs
# Visible in terminal running npm start
```

### Check frontend state
```javascript
// In Expo debugger console
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getItem('auth').then(console.log);
```

---

## 📚 Documentation Files

- `README.md` - Main project documentation
- `backend/README.md` - Backend API docs
- `frontend/README.md` - Frontend setup guide
- `IMPLEMENTATION_SUMMARY.md` - All changes made

---

## 🎓 Learning Resources

### User Flow
1. User logs in with employee number
2. JWT token issued and stored
3. User routed to role-specific dashboard
4. Can perform actions based on role
5. Token expires in 1 day

### Architecture
```
Frontend (Expo/React Native)
    ↓
AsyncStorage (token, user)
    ↓
API Calls (axios/fetch)
    ↓
Backend (Express)
    ↓
Middleware (auth, authorize)
    ↓
Routes (business logic)
    ↓
Models (User, Task)
    ↓
MongoDB (data persistence)
```

---

**Last Updated:** April 2026
**Status:** ✅ Production Ready
