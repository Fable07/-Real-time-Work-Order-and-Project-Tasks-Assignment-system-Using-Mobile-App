# Complete Setup Guide for New Machine

**Target Audience**: First-time setup from scratch  
**Difficulty**: Easy  
**Time**: ~15 minutes

---

## 📋 Prerequisites

Before starting, make sure you have installed:

- ✅ **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- ✅ **MongoDB** - Local or Cloud ([MongoDB Compass](https://www.mongodb.com/products/compass) for GUI)
- ✅ **Git** - To clone the project
- ✅ **Visual Studio Code** (optional, recommended)

### Verify Installation
```bash
node --version    # Should show v14+
npm --version     # Should show 8+
git --version     # Should show 2+
mongosh --version # Should show version number
```

---

## 🚀 Step-by-Step Setup

### Step 1: Clone the Project
```bash
git clone https://github.com/your-username/capstone2.git
cd capstone2
```

### Step 2: Start MongoDB

**Option A: Local MongoDB (if installed)**
```bash
# Windows: Open new terminal/PowerShell
mongod

# You should see:
# [initandlisten] waiting for connections on port 27017
```

**Option B: MongoDB Atlas (Cloud)**
```
1. Go to: https://cloud.mongodb.com/
2. Create free account
3. Create database cluster
4. Get connection string
5. Save it for Step 4
```

**Option C: Docker (if you have Docker installed)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### Step 3: Setup Backend

**Terminal 1: Backend Setup**
```bash
cd capstone2/backend

# Install dependencies
npm install

# Create .env file
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env

# Edit .env file with your MongoDB connection
# Open backend/.env and verify:
PORT=5500
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key_min_32_chars
NODE_ENV=development
```

**Check .env looks like this**:
```env
PORT=5500
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=capstone2_secret_key_2026_change_in_production
NODE_ENV=development
```

### Step 4: Start Backend

**Still in Terminal 1**:
```bash
npm start

# Wait for this message:
# ✅ Connected to MongoDB
# ✅ Server listening on port 5500
```

✅ Backend is now running!

### Step 5: Seed Test Users

**Terminal 2: Database Seeding**
```bash
cd capstone2/backend
node seed-db.js
```

**Expected output**:
```
🌱 Starting Database Seeding...

✅ Connected to MongoDB

📝 Creating test users...

✅ ADMIN001 (admin) - Created successfully
✅ HRD001 (hrd) - Created successfully
✅ MANAGER001 (manager) - Created successfully
✅ SUPERVISOR001 (supervisor) - Created successfully
✅ WORKER001 (worker) - Created successfully
✅ WORKER002 (worker) - Created successfully

✨ Ready to test!
```

✅ Test users are now in database!

### Step 6: Setup Frontend

**Terminal 3: Frontend Setup**
```bash
cd capstone2/frontend

# Install dependencies
npm install

# Verify Config.ts has correct API URL
# For Android Emulator (default):
# export const API_URL = "http://10.0.2.2:5500/api";

# For Physical Device on same network:
# export const API_URL = "http://YOUR_IP:5500/api";
# (Replace YOUR_IP with your machine's IP, e.g., 192.168.1.100)
```

### Step 7: Start Frontend

**Still in Terminal 3**:
```bash
npm start

# You should see:
# Metro waiting on exp://YOUR_IP:8082
# Web is waiting on http://localhost:8082
# Press a │ open Android
# Press w │ open web
```

### Step 8: Open on Android

**In the Expo terminal, press `a`** to open Android emulator or **scan the QR code with Expo Go app**.

---

## 🧪 Test the Login

### Test Credentials

Choose one to test:

| Role | Employee No | Password |
|------|-----------|----------|
| Admin | ADMIN001 | admin123pass |
| HRD | HRD001 | hrd123pass |
| Manager | MANAGER001 | manager123pass |
| Supervisor | SUPERVISOR001 | supervisor123pass |
| Worker | WORKER001 | worker123pass |

### Test on Android

1. App should load with login screen
2. Enter Employee No: **ADMIN001**
3. Enter Password: **admin123pass**
4. Tap Login
5. Should see Admin Dashboard

✅ If you see dashboard → **Setup Complete!**

❌ If error → See "Troubleshooting" below

---

## 🔧 Troubleshooting During Setup

### Error: "Cannot find module 'express'"
```bash
# Solution: npm not run
cd backend && npm install
```

### Error: "ECONNREFUSED 127.0.0.1:27017"
```bash
# Solution: MongoDB not running
# Start MongoDB:
mongod
# Then restart backend: npm start
```

### Error: "Invalid credentials"
```bash
# Solution: Test users not created
cd backend && node seed-db.js
```

### Error: "Cannot connect to server"
```bash
# Solution: Backend not running or wrong API URL
# 1. Check backend terminal shows "✅ Server listening on port 5500"
# 2. Check frontend API_URL in constants/Config.ts
```

### Error: "Port 8081 already in use"
```bash
# Solution: Another Expo app is running
# Press 'Y' when asked to use port 8082 instead
```

### Error: ".env file not found"
```bash
cd backend
cp .env.example .env
# Edit .env with your settings
npm start
```

---

## ✅ Complete Checklist

```
[ ] Node.js installed (v14+)
[ ] MongoDB running (mongod or Docker)
[ ] Git installed
[ ] Project cloned: git clone ...
[ ] Backend dependencies: npm install (in backend)
[ ] Backend .env created and configured
[ ] Backend started: npm start
[ ] Test users created: node seed-db.js
[ ] Frontend dependencies: npm install (in frontend)
[ ] Frontend Config.ts API URL correct
[ ] Frontend started: npm start
[ ] Android emulator opened or Expo Go scanned
[ ] Login with ADMIN001/admin123pass successful
[ ] Admin dashboard visible
```

---

## 📁 What Should Be Open (4 Terminals)

```
Terminal 1: Backend
$ npm start
✅ Connected to MongoDB
✅ Server listening on port 5500

Terminal 2: (Seeding done, can close)
$ node seed-db.js
✅ Created: 6

Terminal 3: Frontend
$ npm start
› Metro waiting on exp://192.168.x.x:8082

Terminal 4: (Optional) MongoDB
$ mongod
[initandlisten] waiting for connections on port 27017
```

---

## 🎯 First Time Success Indicators

✅ **Backend Running**
- Terminal shows: `✅ Server listening on port 5500`
- Logs show: `✅ Connected to MongoDB`

✅ **Database Seeded**
- Seed script output shows: `✅ ADMIN001 (admin) - Created successfully`
- All 6 users created

✅ **Frontend Running**
- Expo terminal shows: `Metro waiting on...`
- App loads on Android/emulator

✅ **Login Works**
- Enter ADMIN001 / admin123pass
- See Admin Dashboard
- No error messages

---

## 🚀 Next Steps After Setup

### First Time Using the System
1. Login as each role to see their dashboards
2. Create a test task as Admin
3. Assign task to supervisor/worker
4. Update task status as worker
5. Check task appears in manager view

### Development
1. Make changes to code
2. Backend changes: Restart `npm start`
3. Frontend changes: Automatically reloads
4. Check logs in terminal for errors

### Production Deployment
See: [ANDROID_TESTING_GUIDE.md](ANDROID_TESTING_GUIDE.md) for APK building

---

## 📞 Still Having Issues?

1. **Run diagnostic tool**:
   ```bash
   node diagnose-setup.js
   ```

2. **Check specific troubleshooting**:
   - Backend issues: See backend logs in terminal
   - Login issues: See [LOGIN_TROUBLESHOOTING.md](LOGIN_TROUBLESHOOTING.md)
   - Frontend issues: Check Expo console

3. **Verify with curl** (backend is working):
   ```bash
   curl -X POST http://localhost:5500/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"employeeNo":"ADMIN001","password":"admin123pass"}'
   ```
   Should return JSON with token (not error)

4. **Check MongoDB**:
   ```bash
   mongosh
   use capstone2_db
   db.users.find()
   # Should show 6 users
   ```

---

## 🎉 You're All Set!

Your Capstone2 system is now fully set up and ready to use!

**Happy coding!** 🚀

