# Login Troubleshooting Guide

**Issue**: Invalid credentials or server error when trying to login  
**Most Common Cause**: Test users not created or MongoDB not running

---

## 🔍 Step 1: Verify Backend is Running

### Check 1a: Is Backend Running?
```bash
# In backend terminal, you should see:
# ✅ Connected to MongoDB on port 27017
# ✅ Server running on port 5500
```

If NOT running:
```bash
cd backend
npm install
npm start
```

### Check 1b: Backend Logs
Look for these messages in terminal:
```
[dotenv@17.2.4] injecting env (3) from .env
✅ Connected to MongoDB
✅ Server listening on port 5500
```

If you see **connection error**, go to Step 2.

---

## 🗄️ Step 2: Verify MongoDB is Running

### For Windows:
```bash
# Check if MongoDB is running
mongosh
# You should see: test> 
# If error, MongoDB is not running
```

### Start MongoDB (if not running):

**Option A: MongoDB Local Installation**
```bash
# If installed locally:
mongod
# Should show: [initandlisten] waiting for connections on port 27017
```

**Option B: Docker (if available)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option C: MongoDB Atlas (Cloud)**
Update `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

---

## ⚙️ Step 3: Check .env Configuration

### Backend `.backend/.env` file should have:

```env
PORT=5500
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key_min_32_chars
NODE_ENV=development
```

**Common Issues**:
- ❌ Missing MONGO_URI → MongoDB won't connect
- ❌ Wrong port → Backend won't start
- ❌ Missing JWT_SECRET → Login will fail

**If .env doesn't exist**:
```bash
cd backend
cp .env.example .env
# Edit .env with proper values
```

---

## 🌱 Step 4: Seed the Database

### This is CRITICAL - test users won't exist without this!

```bash
cd backend
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

📊 Summary:
   ✅ Created: 6
   ⏭️  Skipped: 0
```

**If you see errors**:
- Check MongoDB is running
- Check MONGO_URI in .env
- Try again: `node seed-db.js`

---

## 📱 Step 5: Check Frontend Configuration

### Verify API endpoint in `frontend/constants/Config.ts`:

```typescript
export const API_URL = "http://10.0.2.2:5500/api"; // Android emulator
// OR
export const API_URL = "http://localhost:5500/api"; // Physical device on same network
// OR
export const API_URL = "http://192.168.x.x:5500/api"; // Your machine's IP
```

**How to find your IP**:
```bash
# Windows:
ipconfig
# Look for "IPv4 Address" like 192.168.x.x

# Mac/Linux:
ifconfig
# Look for inet address
```

**For Android Emulator**: Use `10.0.2.2` (special IP for emulator to access host machine)

**For Physical Device**: Use your machine's local IP (e.g., `192.168.1.100`)

---

## 🧪 Step 6: Test Backend Directly

### Test if backend is responding:

```bash
# In PowerShell or terminal, test login:
$headers = @{"Content-Type" = "application/json"}
$body = @{
    "employeeNo" = "ADMIN001"
    "password" = "admin123pass"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5500/api/auth/login" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

**Expected response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "employeeNo": "ADMIN001",
    "role": "admin",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

**If error 401 or "Invalid credentials"**: Database wasn't seeded (Go back to Step 4)

**If connection refused**: Backend not running (Go back to Step 1)

---

## 📋 Complete Setup Checklist

```
Step 1: Is Backend Running?
  [ ] Backend terminal shows "✅ Connected to MongoDB"
  [ ] Backend terminal shows "✅ Server listening on port 5500"

Step 2: Is MongoDB Running?
  [ ] Can connect with mongosh or MongoDB client
  [ ] Shows "waiting for connections on port 27017"

Step 3: .env Configuration?
  [ ] backend/.env exists
  [ ] PORT=5500
  [ ] MONGO_URI=mongodb://localhost:27017/ (or your MongoDB URI)
  [ ] JWT_SECRET is set

Step 4: Database Seeded?
  [ ] Ran: node seed-db.js
  [ ] All 6 test users created
  [ ] No errors during seeding

Step 5: Frontend Configuration?
  [ ] API_URL in Config.ts points to correct backend
  [ ] Using 10.0.2.2 for emulator OR your IP for physical device

Step 6: Backend Response?
  [ ] curl/Postman login returns token
  [ ] Response is not 401 or error
```

---

## 🆘 Quick Fixes by Symptom

### Symptom: "Invalid credentials"
**Cause**: Test users not created  
**Fix**:
```bash
cd backend
node seed-db.js
```

### Symptom: "Cannot reach server" or "Connection timeout"
**Cause**: Backend not running or wrong API URL  
**Fix**:
```bash
# In backend terminal:
npm start

# In frontend, check API_URL in Config.ts points to http://10.0.2.2:5500/api
```

### Symptom: "Server error 500"
**Cause**: MongoDB not connected  
**Fix**:
```bash
# Start MongoDB
mongod
# Then restart backend: npm start
```

### Symptom: "ECONNREFUSED 127.0.0.1:27017"
**Cause**: MongoDB not running  
**Fix**: Start MongoDB service

### Symptom: "Schema hasn't been registered"
**Cause**: Models not properly required  
**Fix**: Make sure backend/models/User.js exists and is imported in routes

### Symptom: Works on one laptop but not another
**Cause**: Environment setup differences  
**Fix**: Verify all steps above on new laptop

---

## 📝 Step-by-Step for New Machine

Run these commands in order:

```bash
# 1. Clone/Copy project
cd capstone2

# 2. Install backend dependencies
cd backend
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Verify MongoDB is running
# (Open separate terminal and run: mongod)

# 5. Start backend
npm start
# Should show: ✅ Connected to MongoDB ✅ Server listening on port 5500

# 6. Seed database (in another terminal)
cd backend
node seed-db.js
# Should create 6 test users

# 7. Install frontend dependencies (in another terminal)
cd ../frontend
npm install

# 8. Start frontend
npm start
# Press 'a' for Android emulator

# 9. Try login with:
# Employee No: ADMIN001
# Password: admin123pass
```

---

## 🔧 Advanced Troubleshooting

### Check MongoDB Database
```bash
mongosh

# In mongosh:
use capstone2_db
db.users.find()
# Should show 6 users
```

### Check Backend Logs for Errors
Look for errors like:
- `MongooseError: Cannot connect to MongoDB`
- `Error: Cannot find module 'mongoose'`
- `JWT_SECRET is undefined`

### Test Each Component

**1. MongoDB**
```bash
mongosh
# Should connect
```

**2. Backend API**
```bash
curl http://localhost:5500/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"employeeNo":"ADMIN001","password":"admin123pass"}'
```

**3. Frontend Network**
```bash
# From frontend terminal, check if API is accessible:
# (This should return JSON, not error)
```

### Check Node Modules
```bash
cd backend
npm ls mongoose express bcryptjs jsonwebtoken
# Should show versions without errors
```

---

## 🎯 Success Indicators

When everything is working:

1. **Backend Terminal**
   ```
   ✅ Connected to MongoDB
   ✅ Server listening on port 5500
   ```

2. **Seed Script Output**
   ```
   ✅ ADMIN001 (admin) - Created successfully
   ✅ HRD001 (hrd) - Created successfully
   ... (all 6 users)
   ```

3. **Frontend Login**
   - Enter: `ADMIN001` / `admin123pass`
   - Should show: Admin Dashboard
   - NO error messages

4. **API Response** (curl/Postman)
   ```json
   {
     "token": "...",
     "user": { ... }
   }
   ```

---

## 📞 Support

If still stuck after all steps:

1. Share backend terminal output
2. Check `capstone2_db` database in MongoDB
3. Verify `.env` file is correct
4. Make sure `npm install` was run in both backend and frontend

**Key Test Credentials**:
```
ADMIN001 / admin123pass
HRD001 / hrd123pass
MANAGER001 / manager123pass
SUPERVISOR001 / supervisor123pass
WORKER001 / worker123pass
WORKER002 / worker456pass
```

