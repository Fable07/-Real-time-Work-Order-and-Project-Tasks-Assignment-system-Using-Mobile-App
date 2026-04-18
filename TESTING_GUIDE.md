# Testing Guide - Capstone2 System

Complete testing checklist for all functionality across backend API and frontend application.

## 🧪 Testing Strategy

### Test Environment Setup
- Backend: http://localhost:5500
- Frontend: Expo dev server (port 8081/8082)
- Database: MongoDB (localhost:27017)

### Test Data Structure
```
Admin User (Full Access)
├── HRD User (Employee Management)
├── Manager User (Task Assignment to Supervisors)
│   └── Supervisor User (Task Assignment to Workers)
│       └── Worker User (Task Execution)
└── Additional Worker Users (for testing)
```

---

## PART 1: Backend API Testing

### Test 1.1: Login Endpoint
**Endpoint:** `POST /api/auth/login`
**Expected:** ✅ Returns JWT token and user info

```bash
# Test 1: Valid credentials
curl -X POST http://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeNo": "ADMIN001", "password": "admin123pass"}'

# Expected Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "fullName": "Admin User",
    "role": "admin",
    "employeeNo": "ADMIN001"
  }
}

# Test 2: Invalid credentials
curl -X POST http://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeNo": "INVALID", "password": "wrongpass"}'

# Expected Response: 401 Unauthorized
```

**Checklist:**
- [ ] Valid credentials return token
- [ ] Invalid credentials return 401
- [ ] Token is JWT format
- [ ] User object contains required fields

---

### Test 1.2: Create User (Admin Only)
**Endpoint:** `POST /api/users/create`
**Auth:** Required (Admin/HRD)

```bash
# Step 1: Login as admin to get token
TOKEN="eyJhbGc..."  # From login endpoint

# Test 1: Admin creates a worker
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "employeeNo": "WORKER001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "09123456789",
    "birthdate": "1995-06-15",
    "password": "worker123pass",
    "role": "worker",
    "department": "Sales"
  }'

# Expected: 201 Created

# Test 2: Admin creates a manager
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "employeeNo": "MANAGER001",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phoneNumber": "09123456780",
    "birthdate": "1992-03-20",
    "password": "manager123pass",
    "role": "manager"
  }'

# Expected: 201 Created

# Test 3: Duplicate employee number
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "employeeNo": "WORKER001",
    ...
  }'

# Expected: 400 Bad Request - "Employee number already exists"

# Test 4: Missing required fields
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "employeeNo": "TEST001",
    "firstName": "Test"
  }'

# Expected: 400 Bad Request - "All fields are required"
```

**Checklist:**
- [ ] Admin can create worker
- [ ] Admin can create manager
- [ ] Admin can create supervisor
- [ ] Duplicate employee number rejected
- [ ] Missing fields rejected
- [ ] Returns 201 status on success

---

### Test 1.3: Create User (HRD Only - Restricted)
**Endpoint:** `POST /api/users/create`
**Auth:** Required (HRD)
**Restriction:** HRD can only create workers

```bash
# Get HRD token
HRD_TOKEN="eyJhbGc..."  # HRD001 login token

# Test 1: HRD creates worker (ALLOWED)
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HRD_TOKEN" \
  -d '{
    "employeeNo": "WORKER002",
    "firstName": "Bob",
    "lastName": "Johnson",
    "email": "bob@example.com",
    "phoneNumber": "09123456781",
    "birthdate": "1996-07-10",
    "password": "worker456pass",
    "role": "worker"
  }'

# Expected: 201 Created

# Test 2: HRD tries to create manager (FORBIDDEN)
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HRD_TOKEN" \
  -d '{
    "employeeNo": "MGR002",
    "firstName": "Carol",
    "lastName": "Brown",
    "email": "carol@example.com",
    "phoneNumber": "09123456782",
    "birthdate": "1991-05-05",
    "password": "manager456pass",
    "role": "manager"
  }'

# Expected: 403 Forbidden - "HRD can only create worker accounts"

# Test 3: No token (UNAUTHORIZED)
curl -X POST http://localhost:5500/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNo": "TEST002",
    ...
  }'

# Expected: 401 Unauthorized - "No token, authorization denied"
```

**Checklist:**
- [ ] HRD can create workers
- [ ] HRD cannot create managers/supervisors
- [ ] Proper 403 error for role restriction
- [ ] Proper 401 error without token

---

### Test 1.4: Get All Users
**Endpoint:** `GET /api/users/all`
**Auth:** Required (Admin/HRD/Manager/Supervisor)

```bash
# Test 1: Admin views all users
curl -X GET http://localhost:5500/api/users/all \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected: Returns all users (no filtering)

# Test 2: HRD views users (should see active workers only)
curl -X GET http://localhost:5500/api/users/all \
  -H "Authorization: Bearer $HRD_TOKEN"

# Expected: Returns only active workers

# Test 3: Worker tries to view (should fail)
curl -X GET http://localhost:5500/api/users/all \
  -H "Authorization: Bearer $WORKER_TOKEN"

# Expected: 403 Forbidden - "Not authorized for this action"

# Test 4: No authentication
curl -X GET http://localhost:5500/api/users/all

# Expected: 401 Unauthorized - "No token, authorization denied"
```

**Checklist:**
- [ ] Admin sees all users
- [ ] HRD sees only active workers
- [ ] Manager/Supervisor can access
- [ ] Worker gets 403 error
- [ ] Unauthenticated gets 401 error

---

### Test 1.5: Create Task
**Endpoint:** `POST /api/tasks/create`
**Auth:** Required (Admin/Manager/Supervisor)

```bash
# Get worker ID from user list
WORKER_ID="..."

# Test 1: Admin creates task
curl -X POST http://localhost:5500/api/tasks/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "taskName": "Complete Report",
    "description": "Finish quarterly report",
    "assignedTo": "'$WORKER_ID'",
    "priority": "high",
    "dueDate": "2026-05-15"
  }'

# Expected: 201 Created

# Test 2: Manager creates task
curl -X POST http://localhost:5500/api/tasks/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -d '{
    "taskName": "Prepare Meeting",
    "description": "Prepare for team meeting",
    "assignedTo": "'$WORKER_ID'",
    "priority": "medium"
  }'

# Expected: 201 Created

# Test 3: Worker tries to create (FORBIDDEN)
curl -X POST http://localhost:5500/api/tasks/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{
    "taskName": "Task Name",
    "assignedTo": "'$WORKER_ID'"
  }'

# Expected: 403 Forbidden - "Not authorized for this action"

# Test 4: Missing required fields
curl -X POST http://localhost:5500/api/tasks/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "description": "Missing task name"
  }'

# Expected: 400 Bad Request - "Task name and assignedTo are required"
```

**Checklist:**
- [ ] Admin can create task
- [ ] Manager can create task
- [ ] Supervisor can create task
- [ ] Worker cannot create task (403)
- [ ] Missing fields rejected (400)
- [ ] Task created with correct priority/dueDate

---

### Test 1.6: Get Tasks (Role-Based Filtering)
**Endpoint:** `GET /api/tasks/all`
**Auth:** Required

```bash
# Test 1: Admin sees all tasks
curl -X GET http://localhost:5500/api/tasks/all \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected: Returns ALL tasks

# Test 2: Worker sees only own tasks
curl -X GET http://localhost:5500/api/tasks/all \
  -H "Authorization: Bearer $WORKER_TOKEN"

# Expected: Returns ONLY tasks assigned to this worker

# Test 3: Supervisor sees assigned tasks
curl -X GET http://localhost:5500/api/tasks/all \
  -H "Authorization: Bearer $SUPERVISOR_TOKEN"

# Expected: Returns tasks ASSIGNED BY this supervisor
```

**Checklist:**
- [ ] Admin sees all tasks
- [ ] Worker sees only own tasks
- [ ] Supervisor sees own assignments
- [ ] Manager can see tasks

---

### Test 1.7: Update Task Status
**Endpoint:** `PATCH /api/tasks/update-status/:id`
**Auth:** Required

```bash
# Get task ID from create response
TASK_ID="..."

# Test 1: Worker updates own task
curl -X PATCH http://localhost:5500/api/tasks/update-status/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"status": "in-progress"}'

# Expected: 200 OK, task status updated

# Test 2: Update to review status
curl -X PATCH http://localhost:5500/api/tasks/update-status/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"status": "review"}'

# Expected: 200 OK

# Test 3: Update to completed
curl -X PATCH http://localhost:5500/api/tasks/update-status/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"status": "completed"}'

# Expected: 200 OK, completedAt timestamp set

# Test 4: Invalid status
curl -X PATCH http://localhost:5500/api/tasks/update-status/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"status": "invalid"}'

# Expected: 400 Bad Request - "Invalid status"
```

**Checklist:**
- [ ] Worker can update own task
- [ ] Status changes to pending/in-progress/review/completed
- [ ] Invalid status rejected
- [ ] completedAt set when completed
- [ ] Manager/Supervisor can update tasks

---

## PART 2: Frontend Testing

### Test 2.1: Login Flow
**Screen:** `(auth)/login.tsx`

```
Steps:
1. Open app in Expo
2. See login screen
3. Enter Employee No: ADMIN001
4. Enter Password: admin123pass
5. Tap Login button

Expected:
✅ Loading indicator appears
✅ Redirects to (admin)/dashboard
✅ User info shows in header
```

**Checklist:**
- [ ] Login screen displays correctly
- [ ] Input validation works
- [ ] Loading state visible
- [ ] Success redirects to dashboard
- [ ] Token stored in AsyncStorage
- [ ] Error message on invalid credentials

---

### Test 2.2: Admin Dashboard
**Screen:** `(admin)/dashboard.tsx`

```
Features to Test:
1. Header displays user name and logout button
2. Stats cards show: Total Users, Total Tasks, Completed, Pending
3. Quick Actions buttons: Create User, Create Task, All Users, All Tasks
4. Team Overview shows manager/supervisor/worker counts
5. Recent Tasks list displays last 5 tasks

Steps:
1. Login as admin
2. Verify all stats load
3. Tap each quick action button
4. Verify navigation works
5. Pull to refresh
6. Verify data updates

Expected:
✅ All elements render
✅ Navigation works
✅ Data loads correctly
✅ Refresh updates data
```

**Checklist:**
- [ ] Stats cards display correct numbers
- [ ] Quick action buttons navigate correctly
- [ ] Team overview cards show correct counts
- [ ] Recent tasks list loads
- [ ] Pull to refresh works
- [ ] Logout button functional
- [ ] Loading indicator during fetch
- [ ] Error handling for failed requests

---

### Test 2.3: Create User (Admin)
**Screen:** `(admin)/create-user.tsx`

```
Steps:
1. Navigate from admin dashboard to Create User
2. Fill in employee details:
   - Employee No: NEWUSER001
   - First Name: Test
   - Last Name: User
   - Phone: 09123456789
   - Email: test@example.com
   - Birthdate: 1995-01-15
   - Password: testpass123
   - Confirm Password: testpass123
   - Role: worker
3. Tap Create Account

Expected:
✅ Form validation works
✅ User created successfully
✅ Success message shown
✅ Redirects back to dashboard
```

**Checklist:**
- [ ] Form displays all fields
- [ ] Password match validation works
- [ ] Email validation works
- [ ] Birthdate format enforced (YYYY-MM-DD)
- [ ] Duplicate email rejected
- [ ] User can select different roles
- [ ] Loading state during submission
- [ ] Success alert shown
- [ ] Redirects to dashboard after creation

---

### Test 2.4: HRD Dashboard
**Screen:** `(hrd)/dashboard.tsx`

```
Steps:
1. Login as HRD001 / hrd123pass
2. Verify redirects to (hrd)/dashboard
3. Check stats: Total Employees, Active, Inactive
4. Verify quick actions: Add Employee, All Employees
5. Check recent employees list
6. Pull to refresh

Expected:
✅ Dashboard shows employee stats
✅ Only active employees listed
✅ Navigation to employee management works
✅ Correct role designation shown
```

**Checklist:**
- [ ] Correct routing for HRD role
- [ ] Stats calculated correctly
- [ ] Employee list loads
- [ ] Employee details show (name, ID, email, status)
- [ ] Status badges show correct color (active=green, inactive=red)
- [ ] Quick actions navigate correctly
- [ ] Pull to refresh updates data
- [ ] Logout functional

---

### Test 2.5: Manager Dashboard
**Screen:** `(manager)/dashboard.tsx`

```
Steps:
1. Login as MANAGER001 / manager123pass
2. Verify redirects to (manager)/dashboard
3. Check stats: My Tasks, Pending, In Progress, Done
4. Verify task list shows tasks assigned to manager
5. Tap a task to open assignment modal
6. Select supervisor to assign task
7. Verify task assigned successfully

Expected:
✅ Correct role routing
✅ Stats show manager's tasks only
✅ Modal opens with supervisor list
✅ Task assignment works
```

**Checklist:**
- [ ] Dashboard shows correct role
- [ ] Task list loads for manager
- [ ] Stats calculated correctly
- [ ] Modal opens on task tap
- [ ] Supervisor list loads in modal
- [ ] Task assignment completes
- [ ] Modal closes after assignment
- [ ] Task disappears from list (reassigned)

---

### Test 2.6: Supervisor Dashboard
**Screen:** `(supervisor)/dashboard.tsx`

```
Steps:
1. Login as SUPERVISOR001 / supervisor123pass
2. Check stats and task list
3. Tap a task to assign to worker
4. Select worker from modal
5. Verify assignment successful

Expected:
✅ Correct supervisor routing
✅ Tasks load correctly
✅ Worker selection works
✅ Assignment completes
```

**Checklist:**
- [ ] Dashboard loads with supervisor role
- [ ] Task list shows supervisor's tasks
- [ ] Worker modal opens and shows available workers
- [ ] Task assignment to worker works
- [ ] Success feedback provided

---

### Test 2.7: Worker Dashboard
**Screen:** `(worker)/dashboard.tsx`

```
Steps:
1. Login as WORKER001 / worker123pass
2. Verify redirects to (worker)/dashboard
3. Check stats: My Tasks, Pending, In Progress, etc.
4. Verify task list shows only own tasks
5. Tap a task to update status
6. Change status: pending → in-progress
7. Tap again to update to review
8. Tap again to mark completed
9. Verify task reflects new status

Expected:
✅ Correct worker routing
✅ Shows only own tasks
✅ Status updates work
✅ Completed tasks marked with checkmark
```

**Checklist:**
- [ ] Dashboard shows worker role
- [ ] Only worker's tasks displayed
- [ ] Status modal opens on task tap
- [ ] Status options available (pending/in-progress/review/completed)
- [ ] Status updates successfully
- [ ] Completed tasks show in completed count
- [ ] Task timestamps update correctly
- [ ] Pull to refresh updates task list

---

### Test 2.8: All Users Screen (Admin)
**Screen:** `(admin)/users.tsx`

```
Steps:
1. From admin dashboard, tap "All Users"
2. Verify user list loads
3. Check user details display (name, email, role, status)
4. Verify role badges display correctly
5. Search/filter if available

Expected:
✅ User list loads completely
✅ All users visible with details
✅ Role colors match design
```

**Checklist:**
- [ ] User list displays all users
- [ ] User details show correctly
- [ ] Role badges colored properly
- [ ] Status shown (active/inactive)
- [ ] Pull to refresh works
- [ ] No crashes or errors

---

### Test 2.9: All Tasks Screen (Admin)
**Screen:** `(admin)/tasks.tsx`

```
Steps:
1. From admin dashboard, tap "All Tasks"
2. Verify task list loads
3. Check task details (name, status, assignee, date)
4. Verify status badges display correctly
5. Verify priority shown if applicable

Expected:
✅ Task list loads completely
✅ All tasks visible with details
✅ Status colors correct
```

**Checklist:**
- [ ] Task list displays all tasks
- [ ] Task details show correctly
- [ ] Status badges colored properly
- [ ] Priority shown (low/medium/high)
- [ ] Due date displayed
- [ ] Assigned to/from names shown
- [ ] Pull to refresh works

---

### Test 2.10: Navigation & Routing
**Overall App Navigation**

```
Test each role's navigation:

ADMIN:
  ✅ /(auth)/login → /(admin)/dashboard
  ✅ Dashboard → Create User
  ✅ Dashboard → Create Task
  ✅ Dashboard → All Users
  ✅ Dashboard → All Tasks
  ✅ Logout → /(auth)/login

HRD:
  ✅ /(auth)/login → /(hrd)/dashboard
  ✅ Dashboard → All Employees (uses admin screens)
  ✅ Logout → /(auth)/login

MANAGER:
  ✅ /(auth)/login → /(manager)/dashboard
  ✅ Can assign tasks
  ✅ Logout → /(auth)/login

SUPERVISOR:
  ✅ /(auth)/login → /(supervisor)/dashboard
  ✅ Can assign tasks
  ✅ Logout → /(auth)/login

WORKER:
  ✅ /(auth)/login → /(worker)/dashboard
  ✅ Can update task status
  ✅ Logout → /(auth)/login
```

**Checklist:**
- [ ] Each role routes to correct dashboard
- [ ] Navigation between screens works
- [ ] Logout returns to login
- [ ] Cannot navigate to unauthorized screens
- [ ] Back button works correctly
- [ ] Deep linking works if implemented

---

## PART 3: Integration Testing

### Test 3.1: Full Task Assignment Flow
**Workflow:** Admin → Manager → Supervisor → Worker

```
Steps:
1. Login as admin
2. Create task "Complete Report"
3. Assign to supervisor SUPERVISOR001
4. Logout
5. Login as supervisor
6. See task in dashboard
7. Assign to worker WORKER001
8. Logout
9. Login as worker
10. See task in my tasks
11. Update status: pending → in-progress → review → completed
12. Logout and verify task completion

Expected:
✅ Each role sees correct data
✅ Task flows through hierarchy
✅ Final status shows completed
```

**Checklist:**
- [ ] Task created successfully
- [ ] Supervisor receives task
- [ ] Worker receives task
- [ ] Status updates work
- [ ] Timestamps accurate

---

### Test 3.2: Employee Management Flow
**Workflow:** Admin/HRD → Create Workers → Manage

```
Steps:
1. Login as admin
2. Create worker account (WORKER002)
3. Create HRD account (HRD002)
4. Logout
5. Login as HRD002
6. Create additional worker (WORKER003)
7. Try to create manager (should fail)
8. Logout
9. Login as WORKER002
10. Verify can see dashboard and tasks

Expected:
✅ Users created with correct roles
✅ HRD restricted to workers only
✅ New users can login
✅ Role-based dashboards work
```

**Checklist:**
- [ ] Admin creates all roles
- [ ] HRD creates workers only
- [ ] Role restrictions enforced
- [ ] New users can login
- [ ] Correct dashboards display

---

## PART 4: Error Handling & Edge Cases

### Test 4.1: Authentication Errors
```
Scenarios:
1. Invalid JWT token format
2. Expired token (wait 1 day or manually test)
3. Missing authorization header
4. Malformed request body
5. Invalid employee number
6. Correct password, wrong username

Expected:
✅ 401 errors for auth failures
✅ Clear error messages
✅ Redirect to login on token failure
```

---

### Test 4.2: Validation Errors
```
Scenarios:
1. Empty required fields
2. Invalid email format
3. Invalid date format
4. Duplicate employee number
5. Duplicate email
6. Password too short (if minimum set)

Expected:
✅ 400 errors for validation failures
✅ Specific error messages
✅ Frontend form validation works
```

---

### Test 4.3: Authorization Errors
```
Scenarios:
1. Worker tries to create task
2. HRD tries to create manager
3. Worker tries to delete user
4. Worker tries to view all users
5. Unauthorized user tries to access protected route

Expected:
✅ 403 errors for forbidden actions
✅ Clear unauthorized messages
```

---

### Test 4.4: Database/Network Errors
```
Scenarios:
1. Stop MongoDB, try to login
2. Simulate network delay
3. Stop backend, try to login from frontend
4. Cancel request mid-flight

Expected:
✅ Error messages displayed
✅ No app crashes
✅ Graceful error handling
```

---

## Testing Checklist Summary

### Backend API
- [ ] All authentication endpoints working
- [ ] All authorization checks in place
- [ ] All CRUD operations functional
- [ ] Error handling correct (400/401/403/500)
- [ ] Token generation and validation
- [ ] Database operations correct
- [ ] Role-based filtering working

### Frontend
- [ ] All screens render correctly
- [ ] Login flow works for all roles
- [ ] Navigation routing correct
- [ ] Data fetching and display
- [ ] Form validation working
- [ ] Error alerts showing
- [ ] Logout functional
- [ ] Pull-to-refresh working
- [ ] Loading states visible

### Integration
- [ ] Task flows through hierarchy
- [ ] Employee management works
- [ ] Role-based access control enforced
- [ ] Data consistency across requests
- [ ] State management correct

### Edge Cases
- [ ] Invalid inputs handled
- [ ] Network errors handled
- [ ] Authorization failures handled
- [ ] Duplicate data rejected
- [ ] Missing data detected

---

## Testing Tools

### Curl / Command Line
For quick API testing without GUI

### Postman / Thunder Client
For organized API testing with history

### React DevTools / Expo Debugger
For frontend state inspection

### MongoDB Compass
For database inspection

---

**Ready to start testing? Follow the tests in order and report any failures!**
