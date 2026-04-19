# Quick Fix - Login Not Working (1 Minute)

**Problem**: Can't login / "Invalid credentials" or "server error"

---

## 🚨 The 3 Most Common Causes

### **Cause #1: Test Users Not Created** (70% of cases)
```bash
cd backend
node seed-db.js
```
✅ If you see 6 users created → Problem solved!  
❌ If error about MongoDB → See Cause #2

---

### **Cause #2: MongoDB Not Running** (20% of cases)
```bash
# Windows: Open new terminal and run:
mongod

# OR if using Docker:
docker run -d -p 27017:27017 mongo

# Then try seeding again:
cd backend
node seed-db.js
```
✅ If MongoDB starts → Problem solved!  
❌ If still error → See Cause #3

---

### **Cause #3: .env File Missing** (10% of cases)
```bash
cd backend
cp .env.example .env
# Edit .env and make sure it has:
#   PORT=5500
#   MONGO_URI=mongodb://localhost:27017/
#   JWT_SECRET=your_secret_key
```
Then:
```bash
npm start
node seed-db.js
```

---

## ✅ Verify It's Working

### In Backend Terminal (should show):
```
✅ Connected to MongoDB
✅ Server listening on port 5500
```

### After Seeding (should show):
```
✅ ADMIN001 (admin) - Created successfully
✅ HRD001 (hrd) - Created successfully
... (all 6 users)
```

### Try Login with:
- **Employee No**: `ADMIN001`
- **Password**: `admin123pass`

---

## 📋 If Still Not Working

Run diagnostic tool:
```bash
node diagnose-setup.js
```

This will tell you exactly what's wrong.

---

## 🆘 Last Resort: Full Fresh Start

```bash
# 1. Delete database (if local MongoDB)
mongosh
# In mongosh:
use capstone2_db
db.dropDatabase()
exit

# 2. Reinstall everything
cd backend
rm -r node_modules
npm install
npm start

# Terminal 2:
cd backend
node seed-db.js

# Terminal 3:
cd frontend
npm install
npm start
```

Then try logging in again.

---

**99% of login issues are fixed by running**: `node seed-db.js`

