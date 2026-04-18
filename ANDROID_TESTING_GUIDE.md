# Android Testing Guide - Capstone2

## System Status ✅

- **Backend**: Running on `http://localhost:5500/api` ✅
- **Database**: MongoDB connected ✅
- **Test Users**: 6 users created (admin, hrd, manager, supervisor, 2 workers) ✅
- **API Tests**: All endpoints verified ✅

---

## Part 1: Running on Android Emulator

### Option A: Using Expo Go (Easiest)

1. **Start Expo Server**
   ```bash
   cd frontend
   npm start
   ```

2. **Android Options**
   - Press `a` to open Android emulator automatically
   - OR scan QR code with Expo Go app on physical device

3. **Expected Output**
   ```
   › Metro waiting on exp://192.168.x.x:8082
   › Android app opened
   ```

### Option B: Building Development Build

```bash
cd frontend
eas build --platform android --profile preview
```

This creates a development APK optimized for testing.

### Option C: Building Production APK

```bash
cd frontend
eas build --platform android --profile production
```

This creates a signed APK ready for deployment.

---

## Part 2: Manual Testing on Android

### Test Scenario 1: Admin Login & Dashboard

**Credentials**: `ADMIN001` / `admin123pass`

**Steps**:
1. Launch app on Android device/emulator
2. Enter Employee No: `ADMIN001`
3. Enter Password: `admin123pass`
4. Tap Login
5. Verify admin dashboard shows:
   - 📊 Total Users
   - 📋 Total Tasks
   - 👥 Department Stats
   - ✏️ Action buttons (Create User, Create Task)

**Expected Results**:
- ✅ Login successful
- ✅ Dashboard displays all stats
- ✅ Navigation menu shows admin options
- ✅ Can navigate to Users and Tasks screens

---

### Test Scenario 2: HRD Login & Employee Management

**Credentials**: `HRD001` / `hrd123pass`

**Steps**:
1. Go to Login screen
2. Enter Employee No: `HRD001`
3. Enter Password: `hrd123pass`
4. Tap Login
5. Verify HRD dashboard shows:
   - 👤 Active Employees count
   - 🚫 Inactive Employees count
   - 📋 Employee list with status badges

**Expected Results**:
- ✅ Login successful
- ✅ HRD dashboard displays employee stats
- ✅ Can see employee list with status
- ✅ Can create new workers only (not managers/supervisors)
- ✅ Can view/edit/delete employee details

---

### Test Scenario 3: Manager Login & Task Assignment

**Credentials**: `MANAGER001` / `manager123pass`

**Steps**:
1. Login as manager
2. Navigate to Dashboard
3. Verify manager can:
   - 📊 View assigned tasks
   - ✏️ Create tasks (assign to supervisors)
   - 👁️ View all supervisors
   - 📈 View department productivity

**Expected Results**:
- ✅ Can only assign tasks to supervisors/workers
- ✅ Cannot create users
- ✅ Cannot delete users
- ✅ Can view task status

---

### Test Scenario 4: Supervisor Login & Task Management

**Credentials**: `SUPERVISOR001` / `supervisor123pass`

**Steps**:
1. Login as supervisor
2. Navigate to Dashboard
3. Verify supervisor can:
   - 📋 View tasks assigned to them
   - ✏️ Assign tasks to workers
   - 👁️ View worker performance
   - 📊 View task statistics

**Expected Results**:
- ✅ Can only assign tasks to workers
- ✅ Cannot modify user accounts
- ✅ Can view but not delete tasks
- ✅ Can see worker assignments

---

### Test Scenario 5: Worker Login & Task Completion

**Credentials**: `WORKER001` / `worker123pass`

**Steps**:
1. Login as worker
2. Navigate to Dashboard
3. Verify worker can:
   - 📋 View assigned tasks
   - ✏️ Update task status (In Progress, Completed)
   - ⏱️ View due dates and priorities
   - 💬 View task descriptions

**Expected Results**:
- ✅ Can see only their own tasks
- ✅ Can mark tasks as in-progress
- ✅ Can mark tasks as completed
- ✅ Cannot create or delete tasks
- ✅ Cannot assign tasks to others

---

## Part 3: Complete Workflow Testing

### Workflow: Task Assignment Chain

1. **Admin Creates Manager** (using HRD or Admin Dashboard)
   - Navigate to Users → Create User
   - Set role to "manager"
   - Verify user created ✅

2. **Manager Creates Task**
   - Login as `MANAGER001`
   - Navigate to Tasks → Create Task
   - Assign to supervisor or worker
   - Set priority: high/medium/low
   - Set due date
   - Verify task created ✅

3. **Supervisor Receives Task**
   - Login as `SUPERVISOR001`
   - Navigate to My Tasks
   - Verify task appears ✅

4. **Supervisor Assigns to Worker**
   - Supervisor reassigns task to worker
   - Verify task appears in worker's list ✅

5. **Worker Updates Task Status**
   - Login as `WORKER001`
   - Open assigned task
   - Update status: In Progress → Completed
   - Verify status updates in real-time ✅

6. **Manager/Admin Review**
   - Login as admin/manager
   - View task status history
   - Verify completion timestamp recorded ✅

---

## Part 4: Edge Cases & Error Handling

### Test: Invalid Login

**Steps**:
1. Enter wrong employee number
2. Tap login
3. **Expected**: Error message "Invalid credentials"

### Test: Unauthorized Actions

**Steps**:
1. Login as `WORKER001`
2. Try to navigate to Users screen (if accessible)
3. Try to navigate to Create Task (if accessible)
4. **Expected**: Either unavailable or 403 Forbidden error

### Test: Missing Required Fields

**Steps**:
1. Navigate to Create User/Task
2. Leave required fields empty
3. Tap Create
4. **Expected**: Validation error messages

### Test: Duplicate Employee No

**Steps**:
1. Try to create user with existing employee no
2. **Expected**: Error "Employee already exists"

### Test: Network Disconnection

**Steps**:
1. Disconnect device from network
2. Try to perform API call (login, create user)
3. **Expected**: Error message "Network error" or "Unable to connect"

---

## Part 5: Performance Testing

### Memory & Loading

- [ ] App starts without lag
- [ ] Dashboard loads within 2 seconds
- [ ] List screens (Users, Tasks) scroll smoothly
- [ ] No crashes when switching screens rapidly

### Data Sync

- [ ] Tasks update in real-time across sessions
- [ ] User status changes reflect immediately
- [ ] Task assignments show instantly

---

## Part 6: Test Credentials Reference

| Role | Employee No | Password | Email |
|------|-----------|----------|-------|
| Admin | ADMIN001 | admin123pass | admin@example.com |
| HRD | HRD001 | hrd123pass | hrd@example.com |
| Manager | MANAGER001 | manager123pass | manager@example.com |
| Supervisor | SUPERVISOR001 | supervisor123pass | supervisor@example.com |
| Worker 1 | WORKER001 | worker123pass | worker@example.com |
| Worker 2 | WORKER002 | worker456pass | john.smith@example.com |

---

## Part 7: Build & Deployment

### Build for Android

```bash
cd frontend
eas build --platform android
```

### Install on Device

```bash
# Download APK and install
adb install app.apk
```

### Test Signed APK

1. Download APK from EAS
2. Transfer to device
3. Install and test all workflows
4. Verify no crashes or errors

---

## Part 8: Checklist

### Authentication ✅
- [ ] Admin can login
- [ ] HRD can login
- [ ] Manager can login
- [ ] Supervisor can login
- [ ] Worker can login
- [ ] Invalid credentials rejected
- [ ] Token persists across sessions
- [ ] Logout works correctly

### Dashboard ✅
- [ ] Admin dashboard shows all stats
- [ ] HRD dashboard shows employee stats
- [ ] Manager dashboard shows task stats
- [ ] Supervisor dashboard shows assigned tasks
- [ ] Worker dashboard shows their tasks

### Users Management ✅
- [ ] Admin can create users
- [ ] HRD can create workers only
- [ ] Cannot create duplicate employee no
- [ ] Can view user list
- [ ] Can edit user details
- [ ] Can delete users
- [ ] Status updates work

### Task Management ✅
- [ ] Admin/Manager can create tasks
- [ ] Tasks assigned correctly
- [ ] Worker sees only their tasks
- [ ] Supervisor sees supervisor-assigned + delegated
- [ ] Task status updates work
- [ ] Priority levels display correctly
- [ ] Due dates show correctly
- [ ] Completion timestamps record

### Permissions ✅
- [ ] Workers cannot create tasks
- [ ] Workers cannot access Users screen
- [ ] Supervisors cannot create managers
- [ ] HRD cannot create managers/supervisors
- [ ] Proper error messages for unauthorized access

### Navigation ✅
- [ ] All navigation links work
- [ ] Back button functions correctly
- [ ] No broken routes
- [ ] Logout clears session

### Data Persistence ✅
- [ ] Data syncs with backend
- [ ] No data loss on app close/reopen
- [ ] Tasks persist across sessions
- [ ] User data updates persist

---

## Quick Start for Testing

```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend (Android)
cd frontend
npm start
# Then press 'a' to open Android emulator or scan QR code with Expo Go

# Terminal 3: Seed Database (already done, but run again if needed)
cd backend
node seed-db.js
```

---

## Troubleshooting

### App won't connect to backend
- Verify backend is running on port 5500
- Check firewall isn't blocking port 5500
- Ensure API endpoint in `Config.ts` matches `http://192.168.x.x:5500/api`

### Login fails
- Verify test user was created (check MongoDB)
- Confirm password is correct
- Check backend logs for errors

### Tasks not appearing
- Verify task was created in dashboard
- Check if user has permission to view task
- Restart app to refresh

### Screen goes blank
- Check browser/emulator console for errors
- Verify all dependencies installed
- Rebuild app: `npm start` then press `r`

---

## Support
For issues, check:
1. Backend logs: Terminal running `npm start` in backend
2. Frontend logs: Expo console
3. MongoDB: Check if data was inserted
4. Network: Ensure backend and frontend can communicate

